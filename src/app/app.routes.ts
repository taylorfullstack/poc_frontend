import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { UnauthGuard } from './auth/unauth.guard';
import { ProtectedLayoutComponent } from './protected-layout/protected-layout.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [UnauthGuard] },
  {
    path: '',
    component: ProtectedLayoutComponent,
    canActivate: [AuthGuard],
    children: [],
  },
];
