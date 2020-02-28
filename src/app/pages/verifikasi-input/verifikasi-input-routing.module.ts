import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerifikasiInputPage } from './verifikasi-input.page';

const routes: Routes = [
  {
    path: '',
    component: VerifikasiInputPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerifikasiInputPageRoutingModule {}
