import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AmbilanPage } from './ambilan.page';
import { NgPipesModule } from 'ngx-pipes';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    NgPipesModule,
    RouterModule.forChild([{ path: '', component: AmbilanPage }])
  ],
  declarations: [AmbilanPage]
})
export class AmbilanPageModule {}
