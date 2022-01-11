import { Component, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MovieService } from '../movie.service';
import { catchError, merge, startWith, switchMap, of as observableOf, map, filter, debounceTime, Subject, Observable } from 'rxjs';
import { Movie } from '../Movie';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddMovieComponent } from '../add-movie/add-movie.component';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements AfterViewInit {
  displayedColumns: string[] = ['Caption', 'Release', 'Length', 'Insert', 'Options'];
  data: Movie[] = [];
  search = new FormControl('');
  @Output() restMethod: EventEmitter<any> = new EventEmitter();

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private movieService: MovieService, public dialog: MatDialog) { }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page, this.search.valueChanges.pipe(debounceTime(800)), this.restMethod)
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

  openDialog(): void {
    const dialogRef = this.dialog.open(AddMovieComponent, {
      width: '375px',
      //data: {caption: this.data[0].caption, movieLength: this.data[0].movieLength},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == true) {
        this.restMethod.emit(null);
      }
    });
  }

  delete(id: number) {
    this.movieService.deleteMovie(id).subscribe(result => {
      this.restMethod.emit(null);
      });
  }

}
