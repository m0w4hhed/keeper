import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { VerifikasiInputPageRoutingModule } from './verifikasi-input-routing.module';
import { VerifikasiInputPage } from './verifikasi-input.page';

import { NgPipesModule } from 'ngx-pipes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgPipesModule,
    VerifikasiInputPageRoutingModule
  ],
  declarations: [VerifikasiInputPage]
})
export class VerifikasiInputPageModule {}
