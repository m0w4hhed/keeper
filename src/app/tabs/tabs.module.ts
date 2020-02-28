import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { AmbilanPageModule } from './ambilan/ambilan.module';
import { KeepPageModule } from './keep/keep.module';
import { AkunPageModule } from './akun/akun.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    SuperTabsModule,
    AmbilanPageModule,
    KeepPageModule,
    AkunPageModule
  ],
  declarations: [TabsPage],
  entryComponents: [
  ]
})
export class TabsPageModule {}
