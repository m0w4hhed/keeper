import { Component, RendererFactory2, Inject, Renderer2 } from '@angular/core';
import { UserService, User } from 'src/app/services/user.service';
import { DOCUMENT } from '@angular/common';
import { ToolService } from 'src/app/services/tool.service';

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
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.userService.user$.subscribe(res => {
      this.user = res;
      this.initial = this.initialName(res.displayName)
    })
    this.renderer = this.rendererFactory.createRenderer(null, null);
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
