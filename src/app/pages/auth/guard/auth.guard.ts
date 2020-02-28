import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { UserService } from '../../../services/user.service';

@Injectable({
    providedIn: 'root'
})
export class isLoggedIn implements CanActivate {
    constructor(
      private userService: UserService,
      private router: Router
    ) { }

    canActivate(next, state): Observable<boolean> {
      return this.userService.user$.pipe(
        take(1),
        map(user => {
          if (user) {
            console.log('[USR] Sudah Login');
            return true;
          } else {
            console.log('[USR] Belum Login');
            this.router.navigate(['/welcome']);
            return false;
          }
        })
      );
    }
    // canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    //   return new Promise((resolve, reject) => {
    //     firebase.auth().onAuthStateChanged(user => {
    //       if (user) {
    //         resolve(true);
    //       } else {
    //         resolve(false);
    //         this.popup.showToast('Anda harus login dulu', 700);
    //         this.saveRouteTo('/login');
    //       }
    //     });
    //   });
    // }
  
    // saveRouteTo(page: string) {
    //   this.zone.run(async () => {
    //     this.router.navigate([page]);
    //   });
    // }
}

// @Injectable({
//     providedIn: 'root'
// })
// export class isActivated implements CanActivate {
//     constructor(private userService: UserService, private router: Router) { }

//     canActivate(next, state): Observable<boolean> {
//       return this.userService.user$.pipe(
//         take(1),
//         map(user => {
//           if (user.activated) { 
//             console.log('[USR] User aktif');
//             return true;
//           } else {
//             console.log('[USR] User belum aktif');
//             this.router.navigate(['/activate']);
//             return false;
//           }
//         })
//       );
//     }
// }
