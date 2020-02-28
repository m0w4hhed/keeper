import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToolService } from 'src/app/services/tool.service';
import { EkspedisiService } from 'src/app/services/ekspedisi.service';
import { DataService } from 'src/app/services/data.service';
import { PopupService } from 'src/app/services/popup.service';
import { UserService } from 'src/app/services/user.service';
import { StorageService } from 'src/app/services/storage.service';
import { Invoice } from 'src/app/services/interfaces/invoice';
import { Kecamatan } from 'src/app/services/interfaces/ongkir';

@Component({
  selector: 'app-verifikasi-input',
  templateUrl: './verifikasi-input.page.html',
  styleUrls: ['./verifikasi-input.page.scss'],
})
export class VerifikasiInputPage implements OnInit {
  
  isAddDiskon = false;
  isAddDeposit = false;
  isProcessing = false;

  inputOrder: Invoice;
  kecamatan: Kecamatan[];

  constructor(
    private modalC2: ModalController,
    public tool: ToolService,
    public userService: UserService,
    private ekspedisi: EkspedisiService,
    private data: DataService,
    private popup: PopupService,
    private storage: StorageService,
  ) { }

  ngOnInit() {
  }

  dismiss() {
    this.modalC2.dismiss();
  }

  verif() {
    this.storage.createInvoice(this.inputOrder).then(
      () => { this.popup.showToast('Input Invoice Sukses', 1000); },
      (err) => { this.popup.showAlert('ERROR', err); }
    );
    // this.inv = {} as Invoice;
    this.dismiss();
  }

}
