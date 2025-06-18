import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckComponent } from './check/check.component';
import { LoginComponent } from './login/login.component';
// import { NewplaceComponent } from './newplace/newplace.component';
import { HotelsComponent } from './hotels/hotels.component';
import { PlaceComponent } from './place/place.component';
import { DetailsComponent } from './details/details.component';
import { MapComponent } from './map/map.component';

const routes: Routes = [
   { path: '', component:LoginComponent},
   {path:'check',component:CheckComponent},
  //  {path:'newplace',component:NewplaceComponent},
   {path:'hotels',component:HotelsComponent},
   {path:'place',component:PlaceComponent},
   {path:'details',component:DetailsComponent},
   {path:'map',component:MapComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

