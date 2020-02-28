import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { isLoggedIn } from './pages/auth/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [isLoggedIn]
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/auth/welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'verifikasi-input',
    loadChildren: () => import('./pages/verifikasi-input/verifikasi-input.module').then( m => m.VerifikasiInputPageModule),
    canActivate: [isLoggedIn]
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
