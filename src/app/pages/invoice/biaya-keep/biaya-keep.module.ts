import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BiayaKeepPageRoutingModule } from './biaya-keep-routing.module';

import { BiayaKeepPage } from './biaya-keep.page';
import { NgPipesModule } from 'ngx-pipes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgPipesModule,
    BiayaKeepPageRoutingModule
  ],
  declarations: [BiayaKeepPage]
})
export class BiayaKeepPageModule {}
