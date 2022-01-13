import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoviesComponent } from '../app/movie/movies/movies.component'
import { UsersComponent } from './user/users/users.component';

const routes: Routes = [
  { path: 'movies', component: MoviesComponent },
  { path: 'users', component: UsersComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
