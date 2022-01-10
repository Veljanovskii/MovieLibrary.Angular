import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
    let params = new HttpParams();
    params = params.append('sort', sort);
    params = params.append('order', order);
    params = params.append('page', page);
    params = params.append('size', size);
    params = params.append('search', search);

    return this._httpClient.get<MoviesCount>(this.moviesUrl, {params: params});
  }

  addMovie(movie: Movie): Observable<Movie> {
    //return this._httpClient.post<Movie>(this.moviesUrl, movie, this.httpOptions);
    return new Observable<Movie>();
  }
}
