import { NgPipesModule } from 'ngx-pipes';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EkspedisiPageRoutingModule } from './ekspedisi-routing.module';

import { EkspedisiPage } from './ekspedisi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgPipesModule,
    EkspedisiPageRoutingModule
  ],
  declarations: [EkspedisiPage]
})
export class EkspedisiPageModule {}
