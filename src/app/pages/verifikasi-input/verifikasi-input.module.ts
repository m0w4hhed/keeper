import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerifikasiInputPageRoutingModule } from './verifikasi-input-routing.module';

import { VerifikasiInputPage } from './verifikasi-input.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerifikasiInputPageRoutingModule
  ],
  declarations: [VerifikasiInputPage]
})
export class VerifikasiInputPageModule {}
