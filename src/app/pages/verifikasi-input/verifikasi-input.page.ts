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
import { User } from 'src/app/services/interfaces/user.config';
import { SwitcherService } from 'src/app/services/switcher.service';

@Component({
  selector: 'app-verifikasi-input',
  templateUrl: './verifikasi-input.page.html',
  styleUrls: ['./verifikasi-input.page.scss'],
})
export class VerifikasiInputPage implements OnInit {
  
  isAddDiskon = false;
  isProcessing = false;

  inputOrder: Invoice;
  kecamatan: Kecamatan[];
  user: User;

  constructor(
    private modalC2: ModalController,
    public tool: ToolService,
    public userService: UserService,
    private popup: PopupService,
    private switcher: SwitcherService
  ) { }

  ngOnInit() {
  }

  dismiss(data?: any|null) {
    this.modalC2.dismiss(data);
  }

  verif() {
    let create = null;
    this.user.activated ? create = this.switcher.createInvoice(this.user, this.inputOrder) : create = this.switcher.createInvoice(this.user, this.inputOrder);
    create.then(
      () => { this.popup.showToast('Input Invoice Sukses', 1000); },
      (err) => { this.popup.showAlert('ERROR', err); }
    );
    // this.inv = {} as Invoice;
    this.dismiss();
  }

}
