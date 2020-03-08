import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KeepPage } from './keep.page';

import { MaterialModule } from 'src/app/modules/material.module';
import { NgPipesModule } from 'ngx-pipes';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MaterialModule,
    NgPipesModule,
    RouterModule.forChild([{ path: '', component: KeepPage }])
  ],
  declarations: [KeepPage]
})
export class KeepPageModule {}
