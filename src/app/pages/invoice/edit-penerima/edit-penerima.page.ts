import { PopupService } from './../../../services/popup.service';
import { Component, OnInit } from '@angular/core';
import { Invoice } from 'src/app/services/interfaces/invoice';
import { EkspedisiService } from 'src/app/services/ekspedisi.service';
import { Kecamatan } from 'src/app/services/interfaces/ongkir';
import { ModalController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { resetBiayaDibayar, resetTotalan, resetEkspedisi } from 'src/app/services/interfaces/variables';

@Component({
  selector: 'app-edit-penerima',
  templateUrl: './edit-penerima.page.html',
  styleUrls: ['./edit-penerima.page.scss'],
})
export class EditPenerimaPage implements OnInit {

  invoice: Invoice;

  editKec = false;
  listKecamatan: Kecamatan[] = [];

  onProcess = false;

  constructor(
    private dataService: DataService,
    private ekspedisi: EkspedisiService,
    private modal: ModalController,
    private popup: PopupService,
  ) { }
  ngOnInit() {
  }

  cariKecamatan(kec: string) {
    if (kec.length > 2) {
      this.listKecamatan = this.ekspedisi.cariKecamatan(kec, 50);
    }
  }
  pilihKecamatan(data: Kecamatan) {
    this.invoice.penerima.kec = data.subdistrict_name;
    this.invoice.penerima.kec_id = data.subdistrict_id;
    this.invoice.penerima.kab = data.city;
    this.invoice.penerima.kab_id = data.city_id;
    this.invoice.penerima.prov = data.province;
    this.invoice.penerima.prov_id = data.province_id;
    this.editKec = false;
  }
  updatePenerima() {
    this.onProcess = true;
    this.dataService.setData(
      `invoice/${this.invoice.id}`, {
        penerima: this.invoice.penerima,
        ...resetEkspedisi,
        ...resetBiayaDibayar,
        ...resetTotalan
      }
    ).then(
      () => { this.popup.showToast('Berhasil memperbarui penerima', 1000); this.onProcess = false; this.dismiss(); },
      (err) => { this.popup.showAlert('ERROR UPDATE', 'Gagal memperbarui penerima!<br>' + err); this.onProcess = false; }
    );
  }

  dismiss() {
    this.modal.dismiss();
  }

}
