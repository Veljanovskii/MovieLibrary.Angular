import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { catchError, Observable } from 'rxjs';
import { MoviesCount } from './MoviesCount';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private _httpClient: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getMovies(sort: string, order: SortDirection, page: number): Observable<MoviesCount> {
    const href = 'https://localhost:44371/api/Movie';
    const requestUrl = `${href}?sort=${sort}&order=${order}&page=${ page + 1 }`;

    return this._httpClient.get<MoviesCount>(requestUrl);
  }
}
