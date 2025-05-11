import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing/landing-page/landing-page.component';
import { LoginComponent } from './login/login/login.component';
import { RegisterComponent } from './login/register/register.component';
import { HousekeeperComponent } from './housekeeper-admin/housekeeper/housekeeper.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import { HousekeeperContentComponent } from './housekeeper-admin/housekeeper-content/housekeeper-content.component';
import { CreateEmployeesComponent } from './housekeeper-admin/create-employees/create-employees.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {MatSelectModule} from "@angular/material/select";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import { CreateRoomsComponent } from './housekeeper-admin/create-rooms/create-rooms.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTabsModule} from "@angular/material/tabs";
import { EmployeesTabComponent } from './housekeeper-admin/employees-tab/employees-tab.component';
import { CreateStatusComponent } from './housekeeper-admin/create-status/create-status.component';
import { CreateTasksComponent } from './housekeeper-admin/create-tasks/create-tasks.component';
import { DashboardComponent } from './housekeeper-user/dashboard/dashboard.component';
import { DashboardRoomsComponent } from './housekeeper-user/dashboard-rooms/dashboard-rooms.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatMenuModule} from "@angular/material/menu";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import { AssignRoomsDialogComponent } from './housekeeper-user/assign-rooms-user-dialog/assign-rooms-dialog.component';
import { AssignRoomsStatusComponent } from './housekeeper-user/assign-rooms-status-dialog/assign-rooms-status.component';
import { ConfirmOverwriteDialogComponent } from './housekeeper-user/confirm-overwrite-dialog/confirm-overwrite-dialog.component';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_FORMATS,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS
} from '@angular/material-moment-adapter';
import { AssignTasksDialogComponent } from './housekeeper-user/assign-room-tasks-dialog/assign-tasks-dialog.component';
import { CompleteTasksComponent } from './housekeeper-user/complete-tasks/complete-tasks.component';
import { ShowLogsComponent } from './housekeeper-user/show-logs/show-logs.component';


@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LoginComponent,
    RegisterComponent,
    HousekeeperComponent,
    HousekeeperContentComponent,
    CreateEmployeesComponent,
    CreateRoomsComponent,
    EmployeesTabComponent,
    CreateStatusComponent,
    CreateTasksComponent,
    DashboardComponent,
    DashboardRoomsComponent,
    AssignRoomsDialogComponent,
    AssignRoomsStatusComponent,
    ConfirmOverwriteDialogComponent,
    AssignTasksDialogComponent,
    CompleteTasksComponent,
    ShowLogsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatInputModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSelectModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatTooltipModule,
    FormsModule,
    MatMenuModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatAutocompleteModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
