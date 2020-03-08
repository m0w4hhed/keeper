import { Component, OnInit } from '@angular/core';
import { Invoice, Penerima, Pengirim } from 'src/app/services/interfaces/invoice';
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
import { EditModalPage } from '../modals/edit-modal/edit-modal.page';

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.page.html',
  styleUrls: ['./edit-invoice.page.scss'],
})
export class EditInvoicePage implements OnInit {

  isAddDiskon = false;
  isAddDeposit = false;
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

  async showEdit(title: string, obj: object, typeValues: object) {
    const passData = Object.entries(obj).map((d, i) => ({key: d[0], value: d[1], type: (typeValues[d[0]]) ? typeValues[d[0]] : 'text' }));
    console.log(passData);
    const modal2 = await this.modalCtrl.create({
      component: EditModalPage,
      cssClass: 'auto-height',
      componentProps: {
        title, data: passData
      }
    });
    await modal2.present();
    const { data } = await modal2.onDidDismiss();
    console.log(data);
  }
  editPengirim(pengirim: Pengirim) {
    const { nama, hp } = pengirim;
    this.showEdit('Edit Pengirim', { nama, hp }, { hp: 'number'})
  }

  editPenerima(penerima: Penerima) {
    const typeValues = {
      alamat: 'textarea',
      hp: 'number',
      kab: 'text',
      kec: 'text',
      kec_id: 'text',
      nama: 'text',
      prov: 'text'
    }
    this.showEdit('Edit Penerima', penerima, typeValues)
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
