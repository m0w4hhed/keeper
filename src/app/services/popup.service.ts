import { Injectable } from '@angular/core';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private iab: InAppBrowser,
    ) {}

  async showToast(message: any, dur: number) {
    const toast = await this.toastController.create({
        color: 'dark',
        message, mode: 'ios',
        position: 'bottom',
        duration: dur
    });
    await toast.present();
  }

  async showAlertConfirm(header: string, message: string) {
    const alert = await this.alertController.create({
      mode: 'ios',
      header,
      message,
      buttons: [
        {
            text: 'Ya',
            handler: () => {
                alert.dismiss(true);
                return false;
            }
        }, {
            text: 'Tidak',
            handler: () => {
                alert.dismiss(false);
                return false;
            }
        }
      ]
    });
    await alert.present();
    const iya = await alert.onDidDismiss();
    console.log(iya);
    return iya.data as boolean;
  }
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      mode: 'ios',
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  contactTo(nomor: number, text: string) {
    const template = encodeURIComponent(text);
    this.iab.create(`https://api.whatsapp.com/send?phone=${nomor}&text=${template}`, '_system');
  }

  // async showLoading(message: string) {
  //   const loading = await this.loadingController.create({
  //     message, mode: 'ios',
  //     translucent: true,
  //   });
  //   return await loading.present();
  // }
  // async hideLoading() {
  //   return this.loadingController.dismiss(null, undefined, null)
  //     .then(() => console.log('loading dismissed'));
  // }
}
