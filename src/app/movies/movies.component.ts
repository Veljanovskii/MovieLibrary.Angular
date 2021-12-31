import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MovieService } from '../movie.service';
import { catchError, merge, startWith, switchMap, of as observableOf, map } from 'rxjs';
import { Movie } from '../Movie';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements AfterViewInit {
  displayedColumns: string[] = ['Id', 'Caption', 'Release Year', 'Length', 'Insert date', 'Delete date'];
  data: Movie[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private movieService: MovieService) { }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.movieService!.getMovies(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.resultsLength = data.total_count;
          return data.movies;
        }),
      )
      .subscribe(data => (this.data = data));
  }
}

// const Movies: Movie[] = [
//   { MovieId: 1, Caption: 'The Wolf of Wallstreet', ReleaseYear: 2013, MovieLength: 180, InsertDate: new Date(2021, 11, 29, 14, 10), DeleteDate: new Date() },
//   { MovieId: 2, Caption: 'Pulp Fiction', ReleaseYear: 1994, MovieLength: 130, InsertDate: new Date(2021, 11, 29, 14, 11), DeleteDate: new Date() },
//   { MovieId: 3, Caption: 'Avatar', ReleaseYear: 2009, MovieLength: 170, InsertDate: new Date(2021, 11, 29, 14, 12), DeleteDate: new Date(2021, 12, 29, 14, 15) }
// ];
