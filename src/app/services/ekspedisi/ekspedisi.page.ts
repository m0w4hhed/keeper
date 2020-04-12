import { ModalController } from '@ionic/angular';
import { EkspedisiService } from './../../services/ekspedisi.service';
import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { PopupService } from 'src/app/services/popup.service';
import { ToolService } from 'src/app/services/tool.service';
import { Ekspedisi, Invoice } from '../interfaces/invoice';
import { GraphqlService } from '../graphql.service';

@Component({
  selector: 'app-ekspedisi',
  templateUrl: './ekspedisi.page.html',
  styleUrls: ['./ekspedisi.page.scss'],
})
export class EkspedisiPage implements OnInit {

  ongkirList; onload = true;
  ekspedisiPilihan: Ekspedisi;

  @Input() invoice: Invoice;
  kecamatanBaki = 5977;
  berat = 0;

  isOnCustom = false;
  ekspedisiCustom: Ekspedisi = {
    kurir: '',
    ongkir: 0,
    service: ''
  };
  customResi: string;
  cod: Ekspedisi = {
    kurir: 'cod',
    service: '',
    ongkir: 0,
  };

  isProcessing = false;

  constructor(
    private gql: GraphqlService,
    private modalCtrl: ModalController,
    private popup: PopupService,
  ) {
  }
  ngOnInit() {
    this.invoice.pesanan.forEach(barang => this.berat += barang.berat);
    this.gql.cekOngkir(this.kecamatanBaki.toString(), this.invoice.penerima.kec_id, this.berat.toString()).subscribe(
      (data) => {
        this.onload = false;
        this.ongkirList = data.map(ongkir => ({
          nama: ongkir.name,
          kurir: ongkir.code.toLowerCase(),
          service: ongkir.service.replace(/paket|next|day|barang|jumbo|khusus/gi, '').trim().toLowerCase(),
          deskripsi: ongkir.description,
          ongkir: ongkir.cost,
          estimasi: ongkir.etd
        }));
        console.log(data);
      },
      (err) => this.popup.showAlert('Internet Bermasalah', err)
    );
  }

  pilihEkspedisi(ekspedisi) {
    console.log(ekspedisi);
    this.ekspedisiPilihan = {
      kurir: ekspedisi.kurir.trim().toLowerCase(),
      ongkir: ekspedisi.ongkir,
      service: ekspedisi.service.trim().toLowerCase(),
    };
  }
  customEkspedisi() {
    const ekspedisi = {} as Ekspedisi;
    ekspedisi.kurir = this.ekspedisiCustom.kurir;
    ekspedisi.ongkir = this.ekspedisiCustom.ongkir;
    ekspedisi.service = this.ekspedisiCustom.service;
    this.customResi ? this.customResi = this.customResi.trim().toUpperCase() : this.customResi = null;
    // console.log(ekspe);
    this.isOnCustom = false;
    this.pilihEkspedisi(ekspedisi);
  }

  pilih() {
    this.dismiss({ekspedisiPilihan: this.ekspedisiPilihan, resi: this.customResi})
  }

  dismiss(data?) {
    if (data) { this.modalCtrl.dismiss(data); }
    else { this.modalCtrl.dismiss({ekspedisiPilihan: null, resi: null}); }
  }

}
