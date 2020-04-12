import { PopupService } from './../../services/popup.service';
import { Component, ViewChild } from '@angular/core';
import { Invoice } from 'src/app/services/interfaces/invoice';
import { Kecamatan } from 'src/app/services/interfaces/ongkir';
import { UserService } from 'src/app/services/user.service';
import { DataService } from 'src/app/services/data.service';
import { ToolService } from 'src/app/services/tool.service';
import { EkspedisiService } from 'src/app/services/ekspedisi.service';
import { ModalController, Platform, IonInput } from '@ionic/angular';
import { VerifikasiInputPage } from 'src/app/pages/verifikasi-input/verifikasi-input.page';
import { User } from 'src/app/services/interfaces/user.config';
import { EditInvoicePage } from 'src/app/pages/invoice/edit-invoice/edit-invoice.page';
import { SwitcherService } from 'src/app/services/switcher.service';
import { ListTokoPage } from 'src/app/pages/list-toko/list-toko.page';
import { EditInvoiceTrialPage } from 'src/app/pages/invoice/edit-invoice-trial/edit-invoice-trial.page';
import { InfoPage } from 'src/app/pages/info/info.page';

@Component({
  selector: 'app-keep',
  templateUrl: 'keep.page.html',
  styleUrls: ['keep.page.scss']
})
export class KeepPage {

  onload = true;
  user: User; task;
  invoices: Invoice[]; task2;

  expand = false;
  trialMode = false;

  input: string;
  inputOrder: Invoice;
  error; actionOnError = false;
  listKecamatan: Kecamatan[];
  kecamatan: Kecamatan;

  @ViewChild('inputan', {static: false}) inputArea;

  constructor(
    private dataService: DataService,
    public userService: UserService,
    public switcher: SwitcherService,
    public tool: ToolService,
    private popup: PopupService,
    private ekspedisi: EkspedisiService,
    private modalCtrl: ModalController,
    private plt: Platform,
  ) {
    this.task = this.userService.user$.subscribe(user => {
      if (user) {
        this.user = user;
        this.plt.ready().then(() => {
          this.task2 = this.switcher.getInvoices(user).subscribe(
            (res: Invoice[]) => {
              this.invoices = res;
              this.onload = false;
              console.log(res);
            },
            err => {
              console.log(err);
              this.onload = false;
            }
          )
        });
      }
    })
  }

  openInput() {
    console.log('open')
    this.inputArea.setFocus();
  }

  async openInvoice(invoice: Invoice) {
    const modal = await this.modalCtrl.create({
      component: this.user.activated ? EditInvoicePage : EditInvoiceTrialPage,
      componentProps: { id: invoice.id, user: this.user }
    });
    return await modal.present();
  }
  async openToko() {
    const modal = await this.modalCtrl.create({
      component: ListTokoPage,
    });
    return await modal.present();
  }
  async help() {
    const helpModal = await this.modalCtrl.create({
      component: InfoPage
    });
    return await helpModal.present();
    // this.popup.showAd('https://images.wallpaperscraft.com/image/kitten_tabby_cat_lying_legs_muzzle_whiskers_78459_800x1200.jpg')
  }

  baca(input: string) {
    this.error = null;
    this.actionOnError = false;
    this.listKecamatan = [];
    if (input) {
      if (input === '') {
        this.inputOrder = {} as Invoice;
      } else {
        const result = this.tool.baca(input, this.user);
        if (result.error) {
          this.error = result.error;
          if (this.error.match(/toko/gi)) { this.actionOnError = true; }
        } else {
          this.inputOrder = result.data;
          const kec = this.inputOrder.penerima.kec;
          if (kec) {
            this.listKecamatan = this.ekspedisi.cariKecamatan(kec, 50);
          }
          if (this.listKecamatan.length === 0) { this.error = `Kecamatan ${kec} tidak ditemukan!`; }
        }
      }
    }
  }
  pilih(kec: Kecamatan) {
    this.kecamatan = kec;
    this.inputOrder.penerima.kec = kec.subdistrict_name;
    this.inputOrder.penerima.kec_id = kec.subdistrict_id;
    this.inputOrder.penerima.kab = kec.city;
    this.inputOrder.penerima.kab_id = kec.city_id;
    this.inputOrder.penerima.prov = kec.province;
    this.inputOrder.penerima.prov_id = kec.province_id;
    console.log(kec);
  }
  async submit(inputOrder: Invoice, user: User) {
    console.log(inputOrder);
    inputOrder.owner = user.uid;
    inputOrder.cs = user.username;
    if (!inputOrder.pengirim.nama) {
      inputOrder.pengirim.nama = user.displayName.toLowerCase();
      inputOrder.pengirim.hp = user.hp;
    }
    inputOrder.pesanan = inputOrder.pesanan.map(
      ({owner, cs, ...barang}) => ({
      ...barang,
      owner: user.uid,
      cs: user.username,
      })
    );
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
    await modalCtrl.present();

    const backData = (await modalCtrl.onWillDismiss()).data;
    if (backData) { this.inputOrder = backData; }
  }

  modeSwitcher(invoice: Invoice[], user: User) {
    if (invoice && !user.activated) {
      this.trialMode = (invoice.length >= 2)
    }
    return invoice;
  }

  onDestroy() {
    this.task.unsubscribe();
  }

}
