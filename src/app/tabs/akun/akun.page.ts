import { Component, RendererFactory2, Inject, Renderer2 } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { DOCUMENT } from '@angular/common';
import { ToolService } from 'src/app/services/tool.service';
import { ModalController } from '@ionic/angular';
import { RegisterPage } from 'src/app/pages/auth/register/register.page';
import { User } from 'src/app/services/interfaces/user.config';

@Component({
  selector: 'app-akun',
  templateUrl: 'akun.page.html',
  styleUrls: ['akun.page.scss']
})
export class AkunPage {

  renderer: Renderer2;
  darkMode = false;

  user: User; initial: string;

  constructor(
    public userService: UserService,
    public tool: ToolService,
    private modal: ModalController,
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.userService.user$.subscribe(res => {
      console.log('[AKUN] Subscribe User')
      this.user = res;
      this.initial = this.initialName(res.displayName)
    })
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  async editProfil() {
    const regModal = await this.modal.create({
      component: RegisterPage,
    });
    regModal.present();
  }

  logout() {
    this.userService.logout();
  }

  initialName(name: string) {
    if (name) {
      const names = name.trim().split(' ').map(n => n.substr(0, 1).toUpperCase());
      let initial = names.join('').substr(0, 1);
      return initial;
    } else { return ''; }
  }

  switchDarkMode() {
    console.log('darkMode=', this.darkMode);
    const renderer = this.renderer;
    this.darkMode ?
      renderer.addClass(this.document.body, 'dark-mode') :
      renderer.removeClass(this.document.body, 'dark-mode')
  }

}
