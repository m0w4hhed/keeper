import { Component } from '@angular/core';
import { SuperTabsConfig } from '@ionic-super-tabs/core';

import { AmbilanPage } from './ambilan/ambilan.page';
import { KeepPage } from './keep/keep.page';
import { AkunPage } from './akun/akun.page';
import { UserService, User } from '../services/user.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  user: User; task;

  constructor(
    private userService: UserService
  ) {
    this.task = this.userService.user$.subscribe(res => this.user = res)
  }

  ambilanPage = AmbilanPage;
  keepPage = KeepPage;
  akunPage = AkunPage;

  config: SuperTabsConfig = {
    allowElementScroll: true,
    avoidElements: true
  };
}
