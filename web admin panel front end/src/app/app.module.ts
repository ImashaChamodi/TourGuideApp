import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database'; // Add AngularFireDatabaseModule for realtime database

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { CheckComponent } from './check/check.component';
import { AppRoutingModule } from './app-routing.module';
import { HotelsComponent } from './hotels/hotels.component';
import { PlaceComponent } from './place/place.component';
import { DetailsComponent } from './details/details.component';
import { MapComponent } from './map/map.component';
// import { NewplaceComponent } from './newplace/newplace.component';
// import { PlaceComponent } from './place/place.component';

// initialize firebase app
// firebase.initializeApp(environment.firebase);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CheckComponent,
    HotelsComponent,
    PlaceComponent,
    DetailsComponent,
    MapComponent,
    // NewplaceComponent,
    // PlaceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
