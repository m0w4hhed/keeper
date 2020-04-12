import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './pages/auth/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/auth/welcome/welcome.module').then( m => m.WelcomePageModule),
    // canActivate: [AuthGuard],
    // data: { isLoggedIn: false, isConfigured: false }
  },
  {
    path: 'verifikasi-input',
    loadChildren: () => import('./pages/verifikasi-input/verifikasi-input.module').then( m => m.VerifikasiInputPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-invoice',
    loadChildren: () => import('./pages/invoice/edit-invoice/edit-invoice.module').then( m => m.EditInvoicePageModule)
  },
  {
    path: 'edit-modal',
    loadChildren: () => import('./pages/modals/edit-modal/edit-modal.module').then( m => m.EditModalPageModule)
  },
  {
    path: 'list-toko',
    loadChildren: () => import('./pages/list-toko/list-toko.module').then( m => m.ListTokoPageModule)
  },
  {
    path: 'edit-invoice-trial',
    loadChildren: () => import('./pages/invoice/edit-invoice-trial/edit-invoice-trial.module').then( m => m.EditInvoiceTrialPageModule)
  },  {
    path: 'biaya-keep',
    loadChildren: () => import('./pages/invoice/biaya-keep/biaya-keep.module').then( m => m.BiayaKeepPageModule)
  },
  {
    path: 'edit-penerima',
    loadChildren: () => import('./pages/invoice/edit-penerima/edit-penerima.module').then( m => m.EditPenerimaPageModule)
  },
  {
    path: 'totalan',
    loadChildren: () => import('./pages/invoice/totalan/totalan.module').then( m => m.TotalanPageModule)
  },
  {
    path: 'info',
    loadChildren: () => import('./pages/info/info.module').then( m => m.InfoPageModule)
  },
  {
    path: 'ekspedisi',
    loadChildren: () => import('./services/ekspedisi/ekspedisi.module').then( m => m.EkspedisiPageModule)
  }


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
