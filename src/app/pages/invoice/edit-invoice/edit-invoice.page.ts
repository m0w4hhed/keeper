import { BiayaKeepPage } from './../biaya-keep/biaya-keep.page';
import { Component, OnInit } from '@angular/core';
import { EkspedisiPage } from '../../../services/ekspedisi/ekspedisi.page';
import { EditModalPage } from '../../modals/edit-modal/edit-modal.page';

import { Invoice, Penerima, Pengirim, Ambilan } from 'src/app/services/interfaces/invoice';
import { User } from 'src/app/services/interfaces/user.config';

import { ModalController } from '@ionic/angular';
import { ToolService } from 'src/app/services/tool.service';
import { UserService } from 'src/app/services/user.service';
import { PopupService } from 'src/app/services/popup.service';
import { SwitcherService } from 'src/app/services/switcher.service';
import { DataService } from 'src/app/services/data.service';
import { TotalanPage } from '../totalan/totalan.page';
import * as firebase from 'firebase';
import { EditPenerimaPage } from '../edit-penerima/edit-penerima.page';
import { resetBiayaDibayar, resetTotalan, resetEkspedisi } from 'src/app/services/interfaces/variables';

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.page.html',
  styleUrls: ['./edit-invoice.page.scss'],
})
export class EditInvoicePage implements OnInit {
  
  isUpdateEkspedisi = false;
  isUpdateBarang = false;
  isTambahBarang = false;
  input = '';

  id: string;
  user: User;

  invoice: Invoice; task;

  constructor(
    private modalCtrl: ModalController,
    public tool: ToolService,
    private popup: PopupService,
    public userService: UserService,
    private switcher: SwitcherService,
    private dataService: DataService,
  ) { }

  ngOnInit() {
    this.task = this.switcher.getInvoice(this.user, this.id).subscribe(res => {
      this.invoice = res;
    });
  }

  invoiceActions() {
    const buttons = [];
    const dibayar = {
      text: 'Invoice Terbayar', icon: 'checkmark-done-circle',
      handler: () => {
        this.dataService.setDatas([{
          path: `invoice/${this.invoice.id}`,
          partialData: { status: 'dibayar', waktuDibayar: this.tool.getTime() }
        }]).then(
          () => this.popup.showToast('Invoice terbayar!', 1000),
          (err) => this.popup.showAlert('ERROR', err)
        );
      }
    };
    const hapus = {
      text: 'Hapus Invoice', icon: 'trash', role: 'destructive',
      handler: () => { this.delete(this.user, this.invoice); }
    };
    const cancel = {
      text: 'Batal', icon: '', role: 'cancel',
      handler: () => {}
    };
    buttons.push(hapus);
    if (this.invoice.status === 'keep') { buttons.push(dibayar); }
    buttons.push(cancel);
    this.popup.showAction(`INVOICE: ${this.invoice.penerima.nama.toUpperCase()}`, buttons);
  }

  async delete(user: User, invoice: Invoice) {
    const iya = await this.popup.showAlertConfirm('Hapus Invoice', 'Yakin mau hapus invoice ini?');
    if (iya) {
      this.switcher.deleteInvoice(user, invoice).then(
        () => {
          this.dismiss();
          this.popup.showToast('Invoice berhasil dihapus', 2000)
        },
        (err) => this.popup.showAlert('ERROR', err)
      );
    }
  }
  copyInvoice(inv: Invoice, share?: boolean) {
    let listBrg = ``;
    inv.pesanan.forEach((item, i) => {
      // tslint:disable-next-line: max-line-length
      listBrg += `${item.toko.toUpperCase()}, ${this.tool.titleCase(item.nama)}, ${this.tool.titleCase(item.warna)}, ${item.hargaJual / 1000}, 1pc\n`;
    });
    let template =
    `Nama: ${inv.penerima.nama.toUpperCase()}\n` +
    `Alamat: ${this.tool.titleCase(inv.penerima.alamat)} ${this.tool.titleCase(inv.penerima.kec)}` +
    `, ${this.tool.titleCase(inv.penerima.kab)}, ${this.tool.titleCase(inv.penerima.prov)}\n` +
    `HP: ${inv.penerima.hp}\n\n` +
    `Pengirim: ${inv.pengirim.nama}\n` + `${inv.pengirim.hp}}\n\n` +
    `KEEP\n${listBrg}\n` +
    `Subtotal: Rp.${this.tool.formatUang(this.olahPesanan(inv).subtotalBarang)}\n` +
    `*${inv.ekspedisi.kurir}* ${inv.ekspedisi.service} [±${inv.berat / 1000}gr]: Rp.${this.tool.formatUang(inv.ekspedisi.ongkir)}\n` +
    `Diskon: Rp.${this.tool.formatUang(inv.diskon)}\n` +
    `TOTAL: *Rp.${this.tool.formatUang(this.olahPesanan(inv).subtotalBarang + inv.ekspedisi.ongkir - inv.diskon)}*`
    // `untuk detail tagihan dan proses pembayaran, silahkan klik link berikut: \n` +
    // `https://nabiilahstore.com/member/invoice/${inv.id}` + `\n` +
    // `⚠ *PRIORITAS DAPAT BARANG BAGI YG TRANSFER DULUAN YA KAK* 😊🙏🏻`
    ;
    this.tool.copy(template).then(
      () => this.popup.showToast('Tagihan tersalin!', 1000),
      (err) => this.popup.showAlert('ERROR SALIN', err)
    );
    if (share) {
      template = encodeURIComponent(template);
      this.tool.wa('', template);
    }
  }

  async updateEkspedisi() {
    const modalEkspedisi = await this.modalCtrl.create({
      component: EkspedisiPage,
      componentProps: { invoice: this.invoice }
    });
    await modalEkspedisi.present();
    const {ekspedisiPilihan, resi} = (await modalEkspedisi.onWillDismiss()).data;
    // jika user memilih ulang ekspedisi maka reset total & biaya_keep
    if (ekspedisiPilihan) {
      this.isUpdateEkspedisi = true;
      const data = {
        ekspedisi: ekspedisiPilihan,
        ...resetBiayaDibayar,
        ...resetTotalan // reset totalan invoice
      }
      const updateData = resi ? { resi, ...data } : { ...data };
      this.dataService.setData(`invoice/${this.invoice.id}`, updateData).then(
        () => {
          this.isUpdateEkspedisi = false;
          this.popup.showToast('Berhasil Perbarui Ekpedisi!', 1000);
        },
        (err) => {
          this.isUpdateEkspedisi = false;
          this.popup.showAlert('Gagal Perbarui Ekspedisi', err);
        }
      )
    }
  }

  tambahBarang() {
    if (this.isTambahBarang) {
      const { listBarang } = this.tool.getBarang(this.input, this.invoice);
      const addAmbilan = listBarang.map(barang => ({
        path: `ambilan/${barang.barcode}`,
        partialData: barang
      }));
      const newBarang = listBarang.map(barang => barang.barcode);
      const updateInvoice = {
        path: `invoice/${this.invoice.id}`,
        partialData: {
          pesanan: firebase.firestore.FieldValue.arrayUnion(...newBarang),
          biaya_dibayar: false,
          ...resetTotalan, // reset totalan invoice
          ...resetEkspedisi,
        }
      };
      this.isUpdateBarang = true;
      this.dataService.setDatas([updateInvoice, ...addAmbilan]).then(
        () => {
          this.input = '';
          this.isTambahBarang = false;
          this.isUpdateBarang = false;
          this.popup.showToast('Berhasil Perbarui Pesanan!', 1000);
        },
        (err) => {
          this.isTambahBarang = false;
          this.isUpdateBarang = false;
          this.popup.showAlert('Gagal Perbarui Pesanan', err);
        }
      );
    } else { this.isTambahBarang = true; }
  }
  async update(barang: Ambilan) {
    const buttons = [];
    const hapus = {
      text: 'Hapus Barang', icon: 'trash', role: 'destructive',
      handler: () => { this.hapusBarang(barang); }
    };
    const diambil = {
      text: 'Barang Terambil', icon: 'checkbox',
      handler: () => { this.updateBarang(barang, 'diambil'); }
    };
    const keep = {
      text: 'Keep Ulang', icon: 'sync',
      handler: () => { this.updateBarang(barang, 'keep'); }
    };
    const kode = {
      text: 'Update Kode Keep', icon: 'code',
      handler: () => { this.updateBarang(barang, 'kode'); }
    };
    const warna = {
      text: 'Update Warna Barang', icon: 'color-palette',
      handler: () => { this.updateBarang(barang, 'warna'); }
    };
    const cancel = {
      text: 'Batal', icon: '', role: 'cancel',
      handler: () => {}
    };
    if (barang.statusKeep !== 'diambil') {
      if (!barang.printed) {
        buttons.push(hapus, diambil, keep);
      }
      buttons.push(kode, warna);
    }
    buttons.push(cancel);
    this.popup.showAction(`${barang.nama.toUpperCase()} ${barang.warna.toUpperCase()}`, buttons);
  }
  async updateBarang(barang: Ambilan, mode: string) {
    let action: Promise<void>;
    if (mode === 'diambil') {
      action = this.dataService.setData(`ambilan/${barang.barcode}`, {
        statusKeep: 'diambil',
        pj: barang.cs,
        waktuDiambil: this.tool.getTime(),
        printed: true
      });
    } else if (mode === 'keep') {
      action = this.dataService.setData(`ambilan/${barang.barcode}`, {
        statusKeep: 'keep',
        pj: null,
        waktuDiambil: 0,
        printed: false,
        waktuPrint: 0,
      });
    } else if (mode === 'kode' || mode === 'warna') {
      const result = await this.popup.showAlertInput(
        `UPDATE ${mode.toUpperCase()}`, `Update ${mode} barang <br><b>${barang.nama}</b> ${barang.warna} ${barang.kode}:`,
        { okBtn: 'Update' }
      );
      if (result) {
        const data = (mode === 'kode') ? { kode: result.toUpperCase().trim() } : { warna: result.toLowerCase().trim() }
        action = this.dataService.setData(`ambilan/${barang.barcode}`, data);
      } else { return; }
    }
    action.then(
      () => {
        this.popup.showToast('Berhasil Perbarui Barang!', 1000);
      },
      (err) => {
        this.popup.showAlert('Gagal Perbarui Barang!', err);
      }
    );
  }
  async hapusBarang(barang: Ambilan) {
    const iya = await this.popup.showAlertConfirm('Hapus Barang', `Yakin mau hapus <b>${barang.nama} ${barang.warna}</b>?`);
    if (iya) {
      const updateInvoice = {
        path: `invoice/${this.invoice.id}`,
        partialData: {
          pesanan: firebase.firestore.FieldValue.arrayRemove(barang.barcode),
          biaya_dibayar: false,
          ...resetTotalan,
          ...resetEkspedisi,
        }
      }
      const delAmbilan = {
        path: `ambilan/${barang.barcode}`,
        delete: true
      }
      this.isUpdateBarang = true;
      this.dataService.setDatas([updateInvoice, delAmbilan]).then(
        () => {
          this.isUpdateBarang = false;
          this.popup.showToast('Berhasil Hapus Pesanan!', 1000);
        },
        (err) => {
          this.isUpdateBarang = false;
          this.popup.showAlert('Gagal Hapus Pesanan', err);
        }
      );
    }
  }

  async biayaKeep() {
    const modalBiaya = await this.modalCtrl.create({
      component: BiayaKeepPage,
      componentProps: { invoice: this.invoice }
    });
    await modalBiaya.present();
  }

  async updateTotalan() {
    const modalTotalan = await this.modalCtrl.create({
      component: TotalanPage,
      componentProps: { invoice: this.invoice }
    });
    await modalTotalan.present();
  }

  bacaBarang(input) { return this.tool.getBarang(input, this.invoice); }
  olahPesanan(invoice: Invoice) { return this.tool.olahPesanan(invoice); }
  cssBarang(barang: Ambilan) { return this.tool.cssBarang(barang); }

  async showEdit(title: string, obj: object, typeValues: object, onSubmitFunction: (passData) => void) {
    // const passData = Object.entries(obj).map((d, i) => (
    //   {key: d[0], value: d[1], type: (typeValues[d[0]]) ? typeValues[d[0]] : 'text' }
    // ));
    const passData = [];
    const functions = { onSubmitFunction } 
    for (var key of Object.keys(typeValues)) {
      passData.push({key, value: obj[key], type: typeValues[key]});
    }
    const modal2 = await this.modalCtrl.create({
      component: EditModalPage,
      cssClass: 'auto-height',
      componentProps: {
        title, data: passData,
        functions
      }
    });
    await modal2.present();
  }
  editPengirim(pengirim: Pengirim) {
    this.showEdit(
      'Edit Pengirim', pengirim,
      { nama: 'text', hp: 'number'},
      (data: Pengirim) => {
        const pengirim = { nama: data.nama.toLowerCase(), hp: data.hp }
        this.dataService.setData(`invoice/${this.invoice.id}`, {pengirim}).then(
          () => this.popup.showToast('Berhasil Update Pengirim!', 1000),
          (err) => this.popup.showAlert('Gagal Update Pengirim', err)
        );
      }
    );
  }
  async editPenerima() {
    const invoice = this.invoice;
    const modalPenerima = await this.modalCtrl.create({
      component: EditPenerimaPage,
      componentProps: { invoice }
    });
    await modalPenerima.present();
  }

  dismiss() {
    this.task.unsubscribe();
    this.modalCtrl.dismiss();
  }

}
