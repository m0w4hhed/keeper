import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TotalanPage } from './totalan.page';

const routes: Routes = [
  {
    path: '',
    component: TotalanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TotalanPageRoutingModule {}
