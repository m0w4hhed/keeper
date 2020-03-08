import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { PopupService } from 'src/app/services/popup.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { User } from 'src/app/services/interfaces/user.config';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  
  onreg = false;
  oncheck = true;

  user: User; task;

  regForm: FormGroup;

  constructor(
    public userService: UserService,
    private popup: PopupService,
    private loadingCtrl: LoadingController,
    private modal: ModalController,
  ) {
    this.user = {} as User;
    this.task = this.userService.user$.subscribe(user => {
      console.log('[REG] Subscribe User');
      this.user.uid = user.uid;
      this.regForm = new FormGroup({
        displayName: new FormControl(user.displayName, Validators.required),
        username: new FormControl((user.username) ? {value: user.username, disabled: true} : '', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15), Validators.pattern('[a-zA-Z0-9_]*')])),
        hp: new FormControl((user.hp) ? {value: user.hp.toString().substring(2), disabled: true} : '', Validators.compose([Validators.required, Validators.minLength(10), Validators.pattern('[0-9]*')]))
      });
    });
  }
  async update(configured: boolean) {
    const loading = await this.loadingCtrl.create({
      message: 'Validasi Akun',
      mode: 'ios', translucent: true
    })
    this.onreg = true;
    this.user.configured = true;
    this.user.displayName = this.regForm.controls.displayName.value.trim().replace(/[^a-z A-Z]/gi, '').toLowerCase();
    this.user.username = this.regForm.controls.username.value.toLowerCase();
    this.user.hp = +('62' + this.regForm.controls.hp.value);
    this.user.deposit = null;
    loading.present();
    this.userService.validasiUser(this.user).then(
      (res) => {
        this.onreg = false;
        loading.dismiss();
        if (res.error) { this.popup.showAlert('Validasi Akun', res.message);
        } else {
          this.userService.updateUser(this.user, {newUser: !configured}).then(
            () => {
              this.dismiss();
              this.popup.showToast('Berhasil memperbarui profil', 1000);
            },
            (err) => this.popup.showAlert('Error Update User!', err)
          );
        }
      },
      (err) => {
        this.onreg = false;
        loading.dismiss();
        this.popup.showAlert('Internet bermasalah, coba sekali lagi!', err);
      }
    );
  }

  dismiss() {
    this.modal.dismiss();
  }
  onDestroy() {
    this.task.unsubscribe();
  }

}
