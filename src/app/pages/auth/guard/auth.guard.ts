import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserService } from '../../../services/user.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
      private userService: UserService,
      private router: Router
    ) { }
    
    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
      return this.userService.auth().pipe(
        switchMap(user => {
          if (user) { return of(true); }
          else {
            this.router.navigate(['/welcome']);
            return of(false);
          }
        })
      )
    }
    // canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    //   firebase.auth().onAuthStateChanged(user => {
    //     if (user) {
    //       console.log('[USR.G] Sudah Login');
    //       const userData = this.userService.getUserData(user.uid);
    //       if (userData.configured) {
    //         console.log('[USR.G] Sudah Registrasi');
    //         resolve(true);
    //       } else {
    //         console.log('[USR.G] Belum Registrasi');
    //         this.router.navigate(['/register']);
    //         resolve(false);
    //       }
    //     } else {
    //       this.router.navigate(['/welcome']);
    //       resolve(false);
    //     }
    //   });
    // }
  
    // saveRouteTo(page: string) {
    //   this.zone.run(async () => {
    //     this.router.navigate([page]);
    //   });
    // }
}
