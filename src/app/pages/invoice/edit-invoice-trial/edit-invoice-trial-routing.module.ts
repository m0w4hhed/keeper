import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditInvoiceTrialPage } from './edit-invoice-trial.page';

const routes: Routes = [
  {
    path: '',
    component: EditInvoiceTrialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditInvoiceTrialPageRoutingModule {}
