import { Component, ViewChild } from '@angular/core';
import { IonSlides, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PopupService } from 'src/app/services/popup.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage {

  showLogin: boolean;
  onlogin = false;
  oncheck = true;
  task;

  @ViewChild('slides', { static: true }) slides: IonSlides;

  constructor(
    private loadingCtrl: LoadingController,
    public router: Router,
    private popup: PopupService,
    private userService: UserService,
  ) {
    this.task = this.userService.user$.subscribe(user => {
      if (user) {
        if (user.configured) {
          console.log('[USR] Sudah registrasi');
          this.router.navigate(['/']);
        } else {
          this.router.navigate(['/register']);
        }
        this.oncheck = false;
      } else {
        this.oncheck = false;
      }
    });
  }
  
  next() {
    this.showLogin ? this.login() : this.nextSlide();
  }
  nextSlide() {
    this.slides.slideNext()
  }
  onSlideChangeStart(event) {
    event.target.isEnd().then(isEnd => {
      this.showLogin = isEnd;
    });
  }

  async login() {
    const loading = await this.loadingCtrl.create({
      message: 'Login Google',
      mode: 'ios', translucent: true
    })
    this.onlogin = true;
    loading.present();
    this.userService.login().then( // loginWithGoogle()
      () => {
        console.log('[LOGIN] Sukses')
        this.onlogin = false;
        loading.dismiss();
      },
      (err) => {
        this.popup.showAlert('[LOGIN] Gagal!', err);
        this.onlogin = false;
        loading.dismiss();
      }
    );
  }

}
