import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MovieService } from 'src/app/services/movie.service';
import { catchError, merge, startWith, switchMap, of as observableOf, map, debounceTime, Subject } from 'rxjs';
import { Movie } from 'src/app/models/Movie';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddMovieComponent } from 'src/app/movie/add-movie/add-movie.component';
import { EditMovieComponent } from 'src/app/movie/edit-movie/edit-movie.component';
import { DeleteMovieComponent } from 'src/app/movie/delete-movie/delete-movie.component';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '220px'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MoviesComponent implements AfterViewInit {
  displayedColumns: string[] = ['Avatar','Caption', 'Release', 'Length', 'Insert'];
  data: Movie[] = [];
  search = new FormControl('');
  loadMovies: Subject<any> = new Subject();
  expandedElement: Movie | null;

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
      width: '600px',
    });

    dialogAddRef.afterClosed().subscribe(result => {
      if(result == true) {
        this.loadMovies.next(null);
      }
    });
  }

  openEditDialog(movie: Movie): void {
    const dialogEditRef = this.dialogEdit.open(EditMovieComponent, {
      width: '600px',
      data: {
        movie: movie,
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
