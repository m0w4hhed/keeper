import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { Invoice, Ambilan } from 'src/app/services/interfaces/invoice';
import { PopupService } from 'src/app/services/popup.service';
import { ToolService } from 'src/app/services/tool.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-totalan',
  templateUrl: './totalan.page.html',
  styleUrls: ['./totalan.page.scss'],
})
export class TotalanPage implements OnInit {

  @Input() invoice: Invoice;
  onProcess = false;

  constructor(
    private modalCtrl: ModalController,
    private popup: PopupService,
    public tool: ToolService,
    private dataService: DataService,
  ) { }
  ngOnInit() {
    console.log(this.invoice);
  }

  async update(mode: string, indexBarang?: number) {
    let message = '';
    if (mode === 'updateMassal') { message = 'Masukkan nominal <b>Laba</b> untuk ditambahkan ke setiap barang'; }
    if (mode === 'hargaJual') {
      message = `Masukkan nominal harga jual <b>${this.invoice.pesanan[indexBarang].nama} ${this.invoice.pesanan[indexBarang].warna}</b>
      <br>(Harga Beli: <b>Rp.${this.invoice.pesanan[indexBarang].hargaBeli}</b>)`; }
    if (mode === 'diskon') { message = 'Masukkan nominal <b>diskon</b>'; }
    let nominal = await this.popup.showAlertInput(null, message,
    { okBtn: 'Update', inputType: 'number'});
    if (nominal) {
      nominal = Number(nominal);
      if (mode === 'updateMassal') {
        this.invoice.pesanan = this.invoice.pesanan.map(({hargaJual, hargaBeli, biaya_keep,...barang}) => {
          return {hargaJual: hargaBeli + nominal + biaya_keep, hargaBeli, biaya_keep, ...barang}
        });
      }
      if (mode === 'hargaJual') { this.invoice.pesanan[indexBarang].hargaJual = nominal; }
      if (mode === 'diskon') { this.invoice.diskon = nominal; }
    }
  }

  olahPesanan(invoice: Invoice) {
    return this.tool.olahPesanan(invoice);
  }

  totalan() {
    if (!this.olahPesanan(this.invoice).belumTotalan) {
      this.onProcess = true;
      const diskon = this.invoice.diskon;
      const total = this.olahPesanan(this.invoice).subtotalBarang + this.invoice.ekspedisi.ongkir - this.invoice.diskon;
      // console.log(this.invoice);
      const datas = [];
      datas.push({path: `invoice/${this.invoice.id}`, partialData: {total, diskon}});
      this.invoice.pesanan.forEach(barang => {
        const partialData = {hargaJual: barang.hargaJual}
        datas.push({path: `ambilan/${barang.barcode}`, partialData})
      });
      this.dataService.setDatas(datas).then(
        () => {
          this.popup.showToast('Berhasil Totalan!', 1000);
          this.dismiss();
        },
        (err) => {
          this.onProcess = false;
          this.popup.showAlert('Error Update!', err);
        }
      );
    } else { this.dismiss(); }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
