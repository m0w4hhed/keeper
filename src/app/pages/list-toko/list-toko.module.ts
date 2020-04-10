import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ListTokoPageRoutingModule } from './list-toko-routing.module';
import { ListTokoPage } from './list-toko.page';

import { NgPipesModule } from 'ngx-pipes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgPipesModule,
    ListTokoPageRoutingModule
  ],
  declarations: [ListTokoPage]
})
export class ListTokoPageModule {}
