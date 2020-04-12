import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditPenerimaPage } from './edit-penerima.page';

const routes: Routes = [
  {
    path: '',
    component: EditPenerimaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditPenerimaPageRoutingModule {}
