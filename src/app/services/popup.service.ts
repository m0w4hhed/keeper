import { Injectable } from '@angular/core';
import { ToastController, AlertController, ActionSheetController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private acSheetController: ActionSheetController,
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
  /**
   * @param inputType "text" (default) | "number" | "date" | "email" | "password" | "search" | "tel" | "url" | "time" | "checkbox" | "radio"
   */
  async showAlertInput(header: string, message: string, options?: {okBtn?: string, inputType?: any, placeholder?: string}) {
    const alert = await this.alertController.create({
      mode: 'ios', header, message,
      cssClass: 'input-alert',
      inputs: [
        {
          name: 'input', type: options ? options.inputType : 'text',
          placeholder: options ? options.placeholder : ''
        }
      ],
      buttons: [
        {
          text: 'Batal',
          cssClass: 'primary',
          handler: () => {
            alert.dismiss(null);
          }
        },
        {
          text: options ? options.okBtn : 'Ok',
          handler: (data) => {
            alert.dismiss(data.input.trim());
          }
        }
      ]
    });
    await alert.present();
    const callback = await alert.onDidDismiss();
    return callback.data.values ? callback.data.values.input : null;
  }

  /**
   * @example
   * header: 'Judul',
   * buttons: [
   *    {
   *        text: 'Cancel',
   *        icon: 'close',
   *        role: 'cancel', // 'destructive' | 'cancel'
   *        handler: () => { 
   *            console.log('Cancel clicked');
   *        }
   *    }
   * ]
   */
  async showAction(
      header: string,
      buttons: {text: string, icon: string, handler: () => void, role?: string}[]
    ) {
    const actionSheet = await this.acSheetController.create({
      header, buttons, mode: 'ios'
    });
    await actionSheet.present();
  }

  async showImage(header: string, message: string, linkImg: string) {
    const alert = await this.alertController.create({
      header,
      message: `
        <img src="${linkImg}" style="border-radius: 2px">
        <p>${message}</p>
      `,
      mode: 'ios', cssClass: 'pic-alert',
      buttons: [
        {
          text: 'Tutup',
          handler: () => {
            alert.dismiss();
            return false;
          }
        }
      ]
    });
    return await alert.present();
  }
  
  async showAd(linkImg: string) {
    const alert = await this.alertController.create({
      message: `
        <img src="${linkImg}">
      `,
      mode: 'ios', cssClass: 'pic-ads',
      buttons: [
        {
          text: 'x',
          handler: () => {
            alert.dismiss();
            return false;
          }
        }
      ]
    });
    return await alert.present();
  }

  contactTo(nomor: number, text: string) {
    const template = encodeURIComponent(text);
    this.iab.create(`https://api.whatsapp.com/send?phone=${nomor}&text=${template}`, '_system');
  }

}
