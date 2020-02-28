import { Component } from '@angular/core';
import { Invoice } from 'src/app/services/interfaces/invoice';
import { Kecamatan } from 'src/app/services/interfaces/ongkir';
import { User, UserService } from 'src/app/services/user.service';
import { DataService } from 'src/app/services/data.service';
import { ToolService } from 'src/app/services/tool.service';
import { EkspedisiService } from 'src/app/services/ekspedisi.service';
import { ModalController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { VerifikasiInputPage } from 'src/app/pages/verifikasi-input/verifikasi-input.page';

@Component({
  selector: 'app-keep',
  templateUrl: 'keep.page.html',
  styleUrls: ['keep.page.scss']
})
export class KeepPage {

  invoices: Invoice[]; task2;

  expand = false;

  input: string;
  inputOrder: Invoice; error;
  listKecamatan: Kecamatan[];
  kecamatan: Kecamatan;

  user: User; task;
  olshopInfo;

  constructor(
    public userService: UserService,
    private dataService: DataService,
    private tool: ToolService,
    private ekspedisi: EkspedisiService,
    private modalCtrl: ModalController,
    private storage: StorageService,
    ) {
      this.dataService.c();
      // this.plt.ready().then(() => this.loadKontak());
      this.task = this.userService.user$.subscribe(user => {
        this.user = user;
      });
      // this.task2 = this.storage.getInvoice().subscribe(res => {this.invoices = res; console.log(res); })
    }

  baca(input: string) {
    if (input) {
      if (input === '') {
        this.inputOrder = {} as Invoice;
      } else {
        // console.log('[RESULT]: ', result);
        const result = this.tool.baca(input);
        if (result.error) {
          // this.popup.showAlert('ERROR', result.error);
          // console.log(result.error);
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
    this.inputOrder.penerima.prov = kec.province;
  }
  async submit(inputOrder: Invoice) {
    console.log(inputOrder);
    inputOrder.owner_id = this.user.uid;
    inputOrder.cs = this.user.username;
    if (!inputOrder.pengirim.nama) {
      inputOrder.pengirim.nama = this.user.displayName.toLowerCase();
      inputOrder.pengirim.hp = this.user.hp;
    }
    inputOrder.pesanan = inputOrder.pesanan.map(({owner_id, cs, ...barang}) => ({
      ...barang,
      owner_id: this.user.uid,
      cs: this.user.username,
    }))
    // inputOrder.id = inv.id;
    // inputOrder.berat = inv.berat;
    // inputOrder.cs = this.user.username;
    // inputOrder.penerima = inv.penerima;
    // inputOrder.pengirim = inv.pengirim;
    // inputOrder.pesanan = inv.pesanan;
    // inputOrder.subtotal = inv.total;
    // inputOrder.kodeUnik = inv.kodeUnik;
    const modalCtrl = await this.modalCtrl.create({
      component: VerifikasiInputPage,
      componentProps: {
        inputOrder
      }
    });
    this.input = null;
    this.inputOrder = null; this.error = null;
    this.listKecamatan = null;
    this.kecamatan = null;
    return await modalCtrl.present();
  }

}
