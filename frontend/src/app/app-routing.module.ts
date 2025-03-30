import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LandingPageComponent} from "./landing/landing-page/landing-page.component";
import {LoginComponent} from "./login/login/login.component";
import {RegisterComponent} from "./login/register/register.component";
import {HousekeeperComponent} from "./housekeeper-admin/housekeeper/housekeeper.component";
import {CreateEmployeesComponent} from "./housekeeper-admin/create-employees/create-employees.component";
import {DashboardComponent} from "./housekeeper-user/dashboard/dashboard.component";

const routes: Routes = [
  {path: '', component: LandingPageComponent, pathMatch: 'full', data: { title: 'Housekeeper'}},
  { path: 'login', component: LoginComponent, data: { title: 'Iniciar Sesión | Housekeeper'}},
  { path: 'register', component: RegisterComponent, data: { title: 'Crear cuenta | Housekeeper' }},
  { path: 'app', component: HousekeeperComponent, data: { title: 'Housekeeper' }},
  { path: 'dashboard', component: DashboardComponent, data: { title: 'Housekeeper' }},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
