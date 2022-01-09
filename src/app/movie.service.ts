import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { catchError, Observable, of } from 'rxjs';
import { Movie } from './Movie';
import { MoviesCount } from './MoviesCount';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private moviesUrl = 'https://localhost:44371/api/Movie';

  constructor(private _httpClient: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getMovies(sort: string, order: SortDirection, page: number, size:number, search:string): Observable<MoviesCount> {
    const requestUrl = `${this.moviesUrl}?sort=${sort}&order=${order}&page=${page}&size=${size}&search=${search}`;

    return this._httpClient.get<MoviesCount>(requestUrl);
  }

  addMovie(movie: Movie): Observable<Movie> {
    movie.insertDate = new Date();
    console.warn(movie);

    return this._httpClient.post<Movie>(this.moviesUrl, movie, this.httpOptions);
  }
}
