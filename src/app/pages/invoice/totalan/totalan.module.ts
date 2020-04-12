import { NgPipesModule } from 'ngx-pipes';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TotalanPageRoutingModule } from './totalan-routing.module';

import { TotalanPage } from './totalan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgPipesModule,
    TotalanPageRoutingModule
  ],
  declarations: [TotalanPage]
})
export class TotalanPageModule {}
