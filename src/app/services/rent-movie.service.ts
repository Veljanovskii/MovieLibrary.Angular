import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Movie } from '../models/Movie';

@Injectable({
  providedIn: 'root'
})
export class RentMovieService {

  private rentedMoviesUrl = 'https://localhost:44371/api/RentMovie';

  constructor(private _httpClient: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getMovies(search: string): Observable<Movie[]> {
    let params = new HttpParams();
    params = params.append('search', search);

    return this._httpClient.get<Movie[]>(this.rentedMoviesUrl + "/Search", {params: params});
  }

  getRented(idNumber: string): Observable<Movie[]> {
    let params = new HttpParams();
    params = params.append('idNumber', idNumber);

    return this._httpClient.get<Movie[]>(this.rentedMoviesUrl + "/GetRented", {params: params});
  }

  checkValidUser(idNumber: string): Observable<boolean> {
    let params = new HttpParams();
    params = params.append('idNumber', idNumber);

    return this._httpClient.get<boolean>(this.rentedMoviesUrl + "/CheckValid", {params: params});
  }

  rentMovies(selectedMovies: any[], selectedIDnumber: string): Observable<boolean> {
    let movies = selectedMovies.map(item => item.movieId);

    return this._httpClient.post<boolean>(this.rentedMoviesUrl, {movies, selectedIDnumber}, this.httpOptions);
  }
}
