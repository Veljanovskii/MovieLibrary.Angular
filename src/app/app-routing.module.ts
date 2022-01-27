import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesComponent } from './employee/employees/employees.component';
import { LoginComponent } from './login/login.component';
import { MoviesComponent } from './movie/movies/movies.component'
import { UsersComponent } from './user/users/users.component';
import { AuthGuard } from './helpers/auth.guard';
import { Role } from './models/Role';

const routes: Routes = [
  { path: 'movies', component: MoviesComponent },
  { path: 'users', component: UsersComponent },
  //{ path: 'employees', component: EmployeesComponent, canActivate: [AuthGuard], data: { roles: [Role.Administrator]} },
  { path: 'employees', component: EmployeesComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
