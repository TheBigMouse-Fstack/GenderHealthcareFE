import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { AppointmentPageComponent } from './pages/appointment-page/appointment-page.component';
import { DoctorDetailComponent } from './pages/doctor-detail/doctor-detail.component';
import { DoctorsPageComponent } from './pages/doctors-page/doctors-page.component';
import { ServicesPageComponent } from './pages/services-page/services-page.component';
import { BlogsPageComponent } from './pages/blogs-page/blogs-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'appointment', component: AppointmentPageComponent },
  { path: 'doctor', component: DoctorsPageComponent },
  { path: 'doctor/:id', component: DoctorDetailComponent },
  { path: 'service', component: ServicesPageComponent },
  { path: 'blog', component: BlogsPageComponent },
];
