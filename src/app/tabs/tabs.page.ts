import { Component } from '@angular/core';
import { SuperTabsConfig } from '@ionic-super-tabs/core';

import { AmbilanPage } from './ambilan/ambilan.page';
import { KeepPage } from './keep/keep.page';
import { AkunPage } from './akun/akun.page';
import { UserService } from '../services/user.service';
import { ModalController } from '@ionic/angular';
import { RegisterPage } from '../pages/auth/register/register.page';
import { PopupService } from '../services/popup.service';
import { User } from '../services/interfaces/user.config';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  user: User; task;

  constructor(
    private userService: UserService,
    private modal: ModalController,
    private popup: PopupService,
  ) {
    this.task = this.userService.user$.subscribe(res => {
      console.log('[TABS] Subscribe user');
      this.user = res;
      if (!res.configured) {
        this.popup.showToast('lengkapi data diri sebelum memulai menggunakan <b>Keeper</b> ya kak!', 5000);
        this.showRegister();
      }
    })
  }

  ambilanPage = AmbilanPage;
  keepPage = KeepPage;
  akunPage = AkunPage;

  config: SuperTabsConfig = {
    allowElementScroll: true,
    avoidElements: true
  };

  async showRegister() {
    const regModal = await this.modal.create({
      component: RegisterPage,
    });
    regModal.present();
  }
}
