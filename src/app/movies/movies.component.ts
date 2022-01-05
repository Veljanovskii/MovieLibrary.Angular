import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MovieService } from '../movie.service';
import { catchError, merge, startWith, switchMap, of as observableOf, map, filter, debounceTime } from 'rxjs';
import { Movie } from '../Movie';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements AfterViewInit {
  displayedColumns: string[] = ['Caption', 'Release', 'Length', 'Insert', 'Options'];
  data: Movie[] = [];
  search = new FormControl('');

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private movieService: MovieService) { }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page, this.search.valueChanges.pipe(debounceTime(800)))
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
}
