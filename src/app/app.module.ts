import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { HttpClientModule } from '@angular/common/http';
import { MatSortModule } from '@angular/material/sort';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';

import { AppComponent } from './app.component';
import { UsersComponent } from 'src/app/user/users/users.component';
import { MoviesComponent } from 'src/app/movie/movies/movies.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddMovieComponent } from 'src/app/movie/add-movie/add-movie.component';
import { EditMovieComponent } from 'src/app/movie/edit-movie/edit-movie.component';
import { AppRoutingModule } from './app-routing.module';
import { DeleteMovieComponent } from 'src/app/movie//delete-movie/delete-movie.component';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavComponent } from './navigation/sidenav/sidenav.component';
import { DialogComponent } from './user/dialog/dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    MoviesComponent,
    AddMovieComponent,
    EditMovieComponent,
    DeleteMovieComponent,
    HeaderComponent,
    SidenavComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatSortModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AppRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatListModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
