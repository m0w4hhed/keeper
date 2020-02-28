import { Injectable } from '@angular/core';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    ) {}

  async showToast(message: any, dur: number) {
    const toast = await this.toastController.create({
        color: 'dark',
        message, mode: 'ios',
        position: 'top',
        duration: dur
    });
    await toast.present();
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

  async showLoading(message: string) {
    const loading = await this.loadingController.create({
      message, mode: 'ios',
      translucent: true,
    });
    return await loading.present();
  }
  async hideLoading() {
    return this.loadingController.dismiss(null, undefined, null)
      .then(() => console.log('loading dismissed'));
  }
}
