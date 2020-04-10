import { PopupService } from './../../services/popup.service';
import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-list-toko',
  templateUrl: './list-toko.page.html',
  styleUrls: ['./list-toko.page.scss'],
})
export class ListTokoPage implements OnInit {

  cekToko; onload = false;
  listToko: string[];

  modeCari = false;
  listCari: string[];

  constructor(
    private modal: ModalController,
    public userService: UserService,
    private dataService: DataService,
    private popup: PopupService,
  ) {
    this.listToko = this.userService.user_config$.value.data_toko;
  }
  ngOnInit() {
  }

  cari(text: string) {
    this.modeCari = true;
    this.listCari = this.listToko.filter(x => (x.indexOf(text) !== -1));
  }

  async detailToko(toko) {
    try {
      this.cekToko = toko;
      this.onload = true;
      const info = await this.dataService.getTokoInfo(toko);
      const template = `
        <p><b>NAMA:</b> ${info.nama} <b>(${info.kode})</b></p>
        <p><b>ALAMAT:</b> Lt.<b>${info.lantai}</b> Blok.<b>${info.blok}</b> No.<b>${info.no}</b></p>
      `;
      console.log(info);
      this.onload = false;
      this.cekToko = null;
      this.popup.showAlert('INFO TOKO', template);
    } catch (err) {
      this.onload = false;
      this.cekToko = null;
      this.popup.showAlert('GAGAL AMBIL INFO TOKO', err)
    }
  }

  contact() {
    const waCS = this.userService.user_config$.value.wa_keeper;
    const template = `
      Hai kak, mau request toko:\n\n
      Kode Toko:
      Nama Toko:
      Alamat: Lt. Blok. No.
      No Hp Keep Toko: 62...
      No Hp Gabung Toko: 62...
    `
    this.popup.contactTo(waCS, template);
  }

  dismiss() {
    this.modal.dismiss();
  }

}
