import { Component, OnInit } from '@angular/core';
import { Invoice, Penerima, Pengirim, Ambilan } from 'src/app/services/interfaces/invoice';
import { Kecamatan } from 'src/app/services/interfaces/ongkir';
import { User } from 'src/app/services/interfaces/user.config';
import { ModalController } from '@ionic/angular';
import { ToolService } from 'src/app/services/tool.service';
import { UserService } from 'src/app/services/user.service';
import { DataService } from 'src/app/services/data.service';
import { PopupService } from 'src/app/services/popup.service';
import { StorageService } from 'src/app/services/storage.service';
import { SwitcherService } from 'src/app/services/switcher.service';
import { Observable } from 'rxjs';
import { EditModalPage } from '../../modals/edit-modal/edit-modal.page';

@Component({
  selector: 'app-edit-invoice-trial',
  templateUrl: './edit-invoice-trial.page.html',
  styleUrls: ['./edit-invoice-trial.page.scss'],
})
export class EditInvoiceTrialPage implements OnInit {

  isAddDiskon = false;
  isProcessing = false;

  id: string;
  user: User;

  invoice: Observable<Invoice>

  constructor(
    private modalCtrl: ModalController,
    public tool: ToolService,
    private popup: PopupService,
    public userService: UserService,
    private switcher: SwitcherService,
  ) { }

  ngOnInit() {
    this.invoice = this.switcher.getInvoice(this.user, this.id) as Observable<Invoice>;
  }

  delete(user: User, invoice: Invoice) {
    this.popup.showAlertConfirm('Hapus Invoice', 'Yakin mau hapus invoice ini?').then(
      (iya) => {
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
    );
  }
  
  olahPesanan(invoice: Invoice) { return this.tool.olahPesanan(invoice); }
  cssBarang(barang: Ambilan) { return this.tool.cssBarang(barang); }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
