import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BiayaKeepPage } from './biaya-keep.page';

const routes: Routes = [
  {
    path: '',
    component: BiayaKeepPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BiayaKeepPageRoutingModule {}
