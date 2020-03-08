import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'ambilan',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./ambilan/ambilan.module').then(m => m.AmbilanPageModule)
          }
        ]
      },
      {
        path: 'keep',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./keep/keep.module').then(m => m.KeepPageModule)
          }
        ]
      },
      {
        path: 'akun',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./akun/akun.module').then(m => m.AkunPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/keep',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/keep',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
