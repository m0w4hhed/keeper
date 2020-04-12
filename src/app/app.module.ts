import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// AngularFire Modules
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule, StorageBucket } from '@angular/fire/storage';

// Custom Modules
import { GraphQLModule } from './modules/graphql.module';
import { ApolloModule } from 'apollo-angular';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './pages/auth/guard/auth.guard';
import { IonicStorageModule } from '@ionic/storage';
import { FormsModule } from '@angular/forms';

// Component Modules
import { AppComponent } from './app.component';
import { WelcomePageModule } from './pages/auth/welcome/welcome.module';
import { VerifikasiInputPageModule } from './pages/verifikasi-input/verifikasi-input.module';
import { RegisterPageModule } from './pages/auth/register/register.module';
import { EditInvoicePageModule } from './pages/invoice/edit-invoice/edit-invoice.module';
import { EditModalPageModule } from './pages/modals/edit-modal/edit-modal.module';
import { ListTokoPageModule } from './pages/list-toko/list-toko.module';
import { EditInvoiceTrialPageModule } from './pages/invoice/edit-invoice-trial/edit-invoice-trial.module';
import { InfoPageModule } from './pages/info/info.module';
import { TotalanPageModule } from './pages/invoice/totalan/totalan.module';
import { EditPenerimaPageModule } from './pages/invoice/edit-penerima/edit-penerima.module';
import { BiayaKeepPageModule } from './pages/invoice/biaya-keep/biaya-keep.module';
import { EkspedisiPageModule } from './services/ekspedisi/ekspedisi.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    // Component Modules
    RegisterPageModule,
    VerifikasiInputPageModule,
    WelcomePageModule,
    EditInvoicePageModule,
    EditModalPageModule,
    EditInvoiceTrialPageModule,
    ListTokoPageModule,
    BiayaKeepPageModule,
    EditPenerimaPageModule,
    TotalanPageModule,
    InfoPageModule,
    EkspedisiPageModule,
    BiayaKeepPageModule,
    // Angularfire Modules
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFirestoreModule.enablePersistence({
      synchronizeTabs: true
    }),
    // Custom Modules
    ApolloModule,
    GraphQLModule,
    SuperTabsModule.forRoot(),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GooglePlus,
    InAppBrowser,
    AuthGuard,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: StorageBucket, useValue: 'keeper-reseller.appspot.com'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
