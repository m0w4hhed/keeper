import { PopupService } from './../../../services/popup.service';
import { Pembayaran } from './../../../services/interfaces/pembayaran';
import { Invoice, Ambilan } from './../../../services/interfaces/invoice';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToolService } from 'src/app/services/tool.service';
import { DataService } from 'src/app/services/data.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { GraphqlService } from 'src/app/services/graphql.service';

@Component({
  selector: 'app-biaya-keep',
  templateUrl: './biaya-keep.page.html',
  styleUrls: ['./biaya-keep.page.scss'],
})
export class BiayaKeepPage implements OnInit {

  @Input() invoice: Invoice;
  pembayaran: Pembayaran[]; onload = true;
  totalTerbayar: number = 0;
  pembayaranVerified = true;

  id = 'TR' + this.tool.getTime() + this.tool.uid(2, {alphabetMode: true, mixResult: true});
  progressPercent: number;
  fileBukti; imgBukti;
  isUploading = false;
  @ViewChild('fileButton', {static: false}) fileButton;

  constructor(
    private modal: ModalController,
    public tool: ToolService,
    private dataService: DataService,
    private gql: GraphqlService,
    private popup: PopupService,
    private afStorage: AngularFireStorage,
  ) { }
  ngOnInit() {
    this.dataService.getDatas<Pembayaran>('pembayaran', [{field: 'invoice', comp: '==', value: this.invoice.id}]).subscribe(
      res => {
        this.onload = false;
        this.pembayaran = res.filter(data => data.type !== 'pelunasan');
        this.totalTerbayar = 0;
        this.pembayaranVerified = true;
        res.forEach(byr => {
          if (byr.dicek) { this.totalTerbayar += byr.total; }
          if (!byr.dicek) { this.pembayaranVerified = false; }
        })
        // console.log(this.totalTerbayar, res);
      }
    );
  }

  belumDibayar(invoice: Invoice) {
    return this.tool.olahPesanan(invoice).biayaKeep + this.invoice.ekspedisi.ongkir - this.totalTerbayar;
  }

  cssBarang(item: Ambilan) {
    return this.tool.cssBarang(item);
  }

  select() {
    this.fileButton.nativeElement.click();
  }
  onFileSelect(event) {
    this.progressPercent = null;
    const mimeType = event.target.files[0].type;
    const reader = new FileReader();
    if (mimeType.match(/image\/*/) == null) {
      this.popup.showToast('File tidak didukung', 2000);
      return;
    }
    if (event.target.files.length === 1) {
      this.fileBukti = event.target.files[0];
      reader.readAsDataURL(this.fileBukti);
      reader.onload = () => {
        this.imgBukti = reader.result;
      };
    } else {
      this.popup.showToast('Terlalu banyak file yg dipilih', 2000);
    }
  }
  uploadBukti() {
    this.isUploading = true;
    const tanggal = this.tool.getTime('YYYYMMDD');
    const file = this.fileBukti;
    const filePath = `pembayaran/${tanggal}/${this.id}.jpg`;
    const fileRef = this.afStorage.ref(filePath);
    const task = this.afStorage.upload(filePath, file);
    task.percentageChanges().subscribe(progress => this.progressPercent = Math.floor(progress));
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
          this.ajukan('pembayaran', url);
        });
        this.progressPercent = null;
      })
    ).subscribe();
  }
  ajukan(type: string, url?: string|null) {
    this.isUploading = true;
    const isPembayaran = (type === 'pembayaran');
    const pesanan = isPembayaran ? this.invoice.pesanan.filter(brg => (brg.biaya_dibayar === false)) : [];
    const pembayaran: Pembayaran = {
      id: this.id,
      bukti: url ? url : '',
      invoice: this.invoice.id,
      pesanan,
      owner: this.invoice.owner,
      dicek: false,
      waktu_dibayar: this.tool.getTime(),
      subtotal: isPembayaran ? this.tool.olahPesanan(this.invoice).biayaKeep : 0,
      ongkir: isPembayaran ? this.invoice.ekspedisi.ongkir : 0,
      total: this.belumDibayar(this.invoice),
      type
    };
    this.dataService.setData(`pembayaran/${this.id}`, pembayaran).then(
      () => {
        this.gql.sendNotification(
          `${type.toUpperCase()} KEEP`, `${this.invoice.cs} telah mengajukan ${type} barang keep!`,
          `pembayaran_keeper`, { image: url ? url : '', landingPage: `pembayaran` }
        );
        this.reset();
        this.popup.showToast(`Berhasil mengajukan ${type}!`, 1000);
      },
      (err) => this.popup.showAlert('ERROR', err)
    );
  }

  reset() {
    this.isUploading = false;
    this.fileBukti = null;
    this.imgBukti = null;
  }
  dismiss() {
    this.reset();
    this.modal.dismiss();
  }

}
