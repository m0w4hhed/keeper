import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditInvoiceTrialPageRoutingModule } from './edit-invoice-trial-routing.module';

import { EditInvoiceTrialPage } from './edit-invoice-trial.page';
import { NgPipesModule } from 'ngx-pipes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgPipesModule,
    EditInvoiceTrialPageRoutingModule
  ],
  declarations: [EditInvoiceTrialPage]
})
export class EditInvoiceTrialPageModule {}
