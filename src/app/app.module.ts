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

// Component Modules
import { AppComponent } from './app.component';
import { WelcomePageModule } from './pages/auth/welcome/welcome.module';
import { VerifikasiInputPageModule } from './pages/verifikasi-input/verifikasi-input.module';
import { RegisterPageModule } from './pages/auth/register/register.module';

// AngularFire Modules
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

// Custom Modules
import { GraphQLModule } from './modules/graphql.module';
import { ApolloModule } from 'apollo-angular';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './pages/auth/guard/auth.guard';
import { IonicStorageModule } from '@ionic/storage';
import { FormsModule } from '@angular/forms';
import { EditInvoicePageModule } from './pages/edit-invoice/edit-invoice.module';
import { EditModalPageModule } from './pages/modals/edit-modal/edit-modal.module';

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
    // Angularfire Modules
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
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
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
