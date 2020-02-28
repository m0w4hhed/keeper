import { Injectable, NgZone } from '@angular/core';
import { ActivatedRouteSnapshot, Router, CanActivate } from '@angular/router';
import * as firebase from 'firebase';
import { PopupService } from './popup.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { switchMap, take, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  username: string;
  hp: number;
  configured: boolean;
  activated: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user$: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private http: HttpClient,
    private google: GooglePlus,
    private router: Router,
    private afs: AngularFirestore
    ) {
      this.user$ = this.afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
          } else { return of(null); }
        })
      );
    }

  async loginWithGoogle() {
    try {
      const params = {
        scopes: '',
        webClientId: '634315912528-1h3edn8pda3bk16f6mbgsucgv52ij97u.apps.googleusercontent.com',
        offline: true
      };
      const user = await this.google.login(params);
      const { idToken, accessToken } = user;
      const credential = accessToken ?
      firebase.auth.GoogleAuthProvider.credential(idToken, accessToken) :
      firebase.auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await this.afAuth.auth.signInWithCredential(credential);
      if (userCredential.user) {
        return this.updateUserData(userCredential.user);
      }
    } catch (err) { throw err; }
  }
  async login() {
    try {
      this.afAuth.auth.signInWithEmailAndPassword('coba@coba.com', 'cobacoba');
    } catch (err) { throw err; }
  }
  updateUserData({ uid, email, displayName, photoURL}: firebase.User) {
    const userRef: AngularFirestoreDocument = this.afs.doc(`users/${uid}`);
    const data = { uid, email, displayName, photoURL };
    return userRef.set(data, {merge: true});
  }
  updateUser(user: User, opt?: {newUser: boolean}) {
    if (opt) {
      if (opt.newUser) {
        console.log('[UPDATE USER] New User');
        const batch = this.afs.firestore.batch();
        const userRef = this.afs.doc(`users/${user.uid}`).ref;
        const usernameRef = this.afs.doc(`username/${user.username}`).ref;
        batch.update(userRef, user);
        batch.set(usernameRef, { owner: user.uid });
        return batch.commit();
      }
    } else {
      console.log('[UPDATE USER] Configured User');
      return this.afs.doc(`users/${user.uid}`).update(user);
    }
  }

  async validasiUser(user: User) {
    let result = {error: false, message: ''};
    try {
      console.log(`62${user.hp}`);
      const uExist = (await this.afs.doc(`username/${user.username}`).ref.get()).exists;
      const headers = { 'Access-Control-Allow-Headers': 'Origin' };
      console.log(user.hp);
      const getWA = await this.http.get( // 
        // `https://api.telegram.org/bot996275173:AAEDEHi_r17sDMp2aw0Aq2ldZSYv8U2J0g0/getUpdates`,
        `https://cors-anywhere.herokuapp.com/https://api.whatsapp.com/send?phone=62${user.hp}`,
        {headers, responseType: 'text'}).toPromise();
        const waExist = (getWA.indexOf('Kirim') !== -1);
        console.log(getWA);
      if (uExist) { result = {error: true, message: 'Username tidak tersedia, pilih username lain'}}
      if (!waExist) { result = {error: true, message: 'Nomor Whatsapp tidak valid, masukkan nomor WA Aktif'}}
      return result;
    } catch (err) { throw err; }
  }

  async logout() {
    this.afAuth.auth.signOut().then(
      () => this.router.navigate(['/welcome'])
    );
  }

}
