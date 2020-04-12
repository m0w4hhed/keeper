import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPenerimaPageRoutingModule } from './edit-penerima-routing.module';

import { EditPenerimaPage } from './edit-penerima.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditPenerimaPageRoutingModule
  ],
  declarations: [EditPenerimaPage]
})
export class EditPenerimaPageModule {}
