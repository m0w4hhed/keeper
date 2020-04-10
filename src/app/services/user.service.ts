// import { FcmService } from './fcm.service';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { switchMap } from 'rxjs/operators';
import { GraphqlService } from './graphql.service';
import { User, UserConfig } from './interfaces/user.config';
import { TelegramService } from './tele.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user$: Observable<User>;
  // tslint:disable-next-line: variable-name
  user_config$: BehaviorSubject<UserConfig>; task;

  constructor(
    private afAuth: AngularFireAuth,
    private gql: GraphqlService,
    private google: GooglePlus,
    private router: Router,
    private afs: AngularFirestore,
    // private fcm: FcmService,
    private tele: TelegramService,
  ) {
    this.user_config$ = new BehaviorSubject(null);
    this.user$ = this.auth();
  }

  auth(): Observable<User|null> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          // console.log('USER EXIST', user);
          // this.fcm.subscribeTo(user.uid);
          return this.getUserData(user.uid)
        } else { return of(null); };
      })
    );
  }
  getUserData(uid: string): Observable<User> {
    console.log('[*GET*] USER DATA UPDATED');
    return this.afs.doc<User>(`users/${uid}`).valueChanges();
  }
  initConfigs() {
    console.log('[*GET*] USER CONFIG UPDATED');
    // return (await this.afs.doc<UserConfig>(`configs/user_config`).ref.get()).data() as UserConfig;
    this.task = this.afs.doc<UserConfig>(`configs/user_config`).valueChanges().subscribe(res =>
      this.user_config$.next(res)
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
        return this.registerUser(userCredential.user);
      }
    } catch (err) { throw err; }
  }
  async login() {
    try {
      const userCredential = await this.afAuth.auth.signInWithEmailAndPassword('coba@coba.com', 'cobacoba');
      if (userCredential.user) {
        return this.registerUser(userCredential.user);
      }
    } catch (err) { throw err; }
  }
  async registerUser({ uid, email, displayName, photoURL}: firebase.User) {
    try {
      const userRef: AngularFirestoreDocument = this.afs.doc(`users/${uid}`);
      const registered = (await userRef.ref.get()).exists;
      if (!registered) {
        if (!displayName) { displayName = ''; }
        const data = { uid, email, displayName, photoURL, activated: false, deposit: 0 } as User;
        // this.gql.sendNotification('NEW KEEPER MEMBER!', `${data.email} (${data.displayName}) telah bergabung!`, 'pendaftaran_keeper');
        return userRef.set(data).then(() => { return data; }, (err) => { throw err; });
      }
    } catch (err) { throw err; }
  }
  async updateUser(user: User, opt?: {newUser: boolean}) {
    try {
      const userData = (await this.afs.collection('users').doc(user.uid).ref.get()).data() as User;
      user.activated = userData.activated;
      user.deposit = userData.deposit;
      user.email = userData.email;
      user.uid = userData.uid;
      if (opt) {
        if (opt.newUser) {
          console.log('[UPDATE USER] New User', user);
          const batch = this.afs.firestore.batch();
          const userRef = this.afs.doc(`users/${user.uid}`).ref;
          const usernameRef = this.afs.doc(`username/${user.username}`).ref;
          batch.update(userRef, user);
          batch.set(usernameRef, { owner: user.uid });
          // const USER_CONFIG = await this.getConfigs();
          // tslint:disable-next-line: max-line-length
          // this.tele.sendText(`https://api.whatsapp.com/send?phone=${user.hp}&text=Assalamualaikum.kak.${user.displayName}`, this.user_config$.value.tele_reg);
          return batch.commit();
        }
      } else {
        console.log('[UPDATE USER] Configured User');
        return this.afs.doc(`users/${user.uid}`).update(user);
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async validasiUser(user: User) {
    let result = {error: false, message: ''};
    try {
      const userData = (await this.afs.collection('users').doc(user.uid).ref.get()).data() as User;
      const uExist = (await this.afs.doc(`username/${user.username}`).ref.get()).exists;
      const waExist = await this.gql.cekWA(user.hp.toString());
      if (!user.configured) {
        if (uExist) { result = {error: true, message: 'Username tidak tersedia, pilih username lain'}; }
      } else {
        // code validation for configured user
      }
      if (!waExist) { result = {error: true, message: 'Nomor Whatsapp tidak valid, masukkan nomor WA Aktif'}; }
      return result;
    } catch (err) { throw err; }
  }

  async logout() {
    this.user$ = of(null);
    this.afAuth.auth.signOut().then(
      () => this.router.navigate(['/welcome'])
    );
  }

}
