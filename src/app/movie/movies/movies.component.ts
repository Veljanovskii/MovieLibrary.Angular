import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MovieService } from 'src/app/movie.service';
import { catchError, merge, startWith, switchMap, of as observableOf, map, debounceTime, Subject } from 'rxjs';
import { Movie } from 'src/app/models/Movie';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddMovieComponent } from 'src/app/movie/add-movie/add-movie.component';
import { EditMovieComponent } from 'src/app/movie/edit-movie/edit-movie.component';
import { DeleteMovieComponent } from 'src/app/movie/delete-movie/delete-movie.component';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements AfterViewInit {
  displayedColumns: string[] = ['Caption', 'Release', 'Length', 'Insert', 'Options'];
  data: Movie[] = [];
  search = new FormControl('');
  loadMovies: Subject<any> = new Subject();

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private movieService: MovieService,
    public dialogAdd: MatDialog,
    public dialogEdit: MatDialog,
    public dialogDelete: MatDialog) { }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page, this.search.valueChanges.pipe(debounceTime(800)), this.loadMovies)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.movieService!.getMovies(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.search.value
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          this.resultsLength = data.totalMovies;
          return data.movies;
        }),
      )
      .subscribe(data => (this.data = data));
  }

  openAddDialog(): void {
    const dialogAddRef = this.dialogAdd.open(AddMovieComponent, {
      width: '375px',
    });

    dialogAddRef.afterClosed().subscribe(result => {
      if(result == true) {
        this.loadMovies.next(null);
      }
    });
  }

  openEditDialog(index: number): void {
    const dialogEditRef = this.dialogEdit.open(EditMovieComponent, {
      width: '375px',
      data: {
        movie: this.data[index],
      },
    });

    dialogEditRef.afterClosed().subscribe(result => {
      if(result == true) {
        this.loadMovies.next(null);
      }
    });
  }

  openDeleteDialog(id: number): void {
    const dialogDeleteRef = this.dialogDelete.open(DeleteMovieComponent, {
      width: '375px',
      data: {
        index: id
      }
    });

    dialogDeleteRef.afterClosed().subscribe(result => {
      if(result == true) {
        this.loadMovies.next(null);
      }
    });
  }

}
