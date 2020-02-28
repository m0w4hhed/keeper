import { Component } from '@angular/core';
import { UserService, User } from 'src/app/services/user.service';
import { PopupService } from 'src/app/services/popup.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';

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
    private router: Router,
    private loadingCtrl: LoadingController
  ) {
    this.task = this.userService.user$.subscribe(user => {
      if (user) {
        this.user = user;
        if (user.configured) {
          console.log('[USR] Sudah registrasi');
          this.router.navigate(['/']);
        } else {
          console.log('[USR] Belum registrasi');
          this.regForm = new FormGroup({
            displayName: new FormControl(user.displayName, Validators.required),
            username: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15), Validators.pattern('[a-zA-Z0-9]*')])),
            hp: new FormControl('', Validators.compose([Validators.required, Validators.minLength(10), Validators.pattern('[0-9]*')]))
          });
        };
        this.oncheck = false;
      } else { this.oncheck = false; }
    });
  }
  async register() {
    const loading = await this.loadingCtrl.create({
      message: 'Validasi Akun',
      mode: 'ios', translucent: true
    })
    this.onreg = true;
    this.user.configured = true;
    this.user.displayName = this.regForm.controls.displayName.value.trim().replace(/[^a-z A-Z]/gi, '').toLowerCase();
    this.user.username = this.regForm.controls.username.value.toLowerCase();
    this.user.hp = +('62' + this.regForm.controls.hp.value);
    loading.present();
    this.userService.validasiUser(this.user).then(
      (res) => {
        this.onreg = false;
        loading.dismiss();
        if (res.error) { this.popup.showAlert('Validasi Akun', res.message);
        } else {
          this.userService.updateUser(this.user, {newUser: true}).then(
            () => this.popup.showToast('Berhasil menyimpan data', 1000),
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

  onDestroy() {
    this.task.unsubscribe();
  }

}
