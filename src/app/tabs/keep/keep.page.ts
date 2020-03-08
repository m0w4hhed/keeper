import { Component } from '@angular/core';
import { Invoice } from 'src/app/services/interfaces/invoice';
import { Kecamatan } from 'src/app/services/interfaces/ongkir';
import { UserService } from 'src/app/services/user.service';
import { DataService } from 'src/app/services/data.service';
import { ToolService } from 'src/app/services/tool.service';
import { EkspedisiService } from 'src/app/services/ekspedisi.service';
import { ModalController, Platform } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { VerifikasiInputPage } from 'src/app/pages/verifikasi-input/verifikasi-input.page';
import { User } from 'src/app/services/interfaces/user.config';
import { EditInvoicePage } from 'src/app/pages/edit-invoice/edit-invoice.page';
import { SwitcherService } from 'src/app/services/switcher.service';

@Component({
  selector: 'app-keep',
  templateUrl: 'keep.page.html',
  styleUrls: ['keep.page.scss']
})
export class KeepPage {

  onload = true;
  // invoices;

  expand = false;

  input: string;
  inputOrder: Invoice; error;
  listKecamatan: Kecamatan[];
  kecamatan: Kecamatan;

  constructor(
    public userService: UserService,
    public switcher: SwitcherService,
    private plt: Platform,
    public tool: ToolService,
    private ekspedisi: EkspedisiService,
    private modalCtrl: ModalController,
  ) {
    // this.dataService.c();
    // this.plt.ready().then(() => this.invoices = this.switcher.getInvoice());
  }

  async openInvoice(invoice: Invoice, user: User) {
    const modal = await this.modalCtrl.create({
      component: EditInvoicePage,
      componentProps: { id: invoice.id, user }
    });
    modal.present();
  }

  baca(input: string) {
    if (input) {
      if (input === '') {
        this.inputOrder = {} as Invoice;
      } else {
        const result = this.tool.baca(input);
        if (result.error) {
          this.error = result.error;
        } else {
          this.error = null;
          this.listKecamatan = [];
          this.inputOrder = result.data;
          const kec = this.inputOrder.penerima.kec;
          if (kec) {
            this.listKecamatan = this.ekspedisi.cariKecamatan(kec.trim(), 5);
          }
          if (this.listKecamatan.length === 0) { this.error = `Kecamatan "${kec}" tidak ditemukan!`; }
        }
      }
    }
  }
  pilih(kec: Kecamatan) {
    this.kecamatan = kec;
    this.inputOrder.penerima.kec_id = kec.subdistrict_id;
    this.inputOrder.penerima.kab = kec.city;
    this.inputOrder.penerima.kab_id = kec.city_id;
    this.inputOrder.penerima.prov = kec.province;
    this.inputOrder.penerima.prov_id = kec.province_id;
  }
  async submit(inputOrder: Invoice, user: User) {
    console.log(inputOrder);
    inputOrder.owner = user.uid;
    inputOrder.cs = user.username;
    if (!inputOrder.pengirim.nama) {
      inputOrder.pengirim.nama = user.displayName.toLowerCase();
      inputOrder.pengirim.hp = user.hp;
    }
    inputOrder.pesanan = inputOrder.pesanan.map(({owner, cs, ...barang}) => ({
      ...barang,
      owner: user.uid,
      cs: user.username,
    }))
    const modalCtrl = await this.modalCtrl.create({
      component: VerifikasiInputPage,
      componentProps: {
        inputOrder, user
      }
    });
    this.input = null;
    this.inputOrder = null; this.error = null;
    this.listKecamatan = null;
    this.kecamatan = null;
    return await modalCtrl.present();
  }

}
