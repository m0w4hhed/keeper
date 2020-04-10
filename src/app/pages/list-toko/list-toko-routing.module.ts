import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListTokoPage } from './list-toko.page';

const routes: Routes = [
  {
    path: '',
    component: ListTokoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListTokoPageRoutingModule {}
