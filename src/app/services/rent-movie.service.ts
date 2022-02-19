import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Movie } from '../models/Movie';
import { MovieLight } from '../models/MovieLight';

@Injectable({
  providedIn: 'root'
})
export class RentMovieService {

  private rentedMoviesUrl = 'https://localhost:44371/api/RentMovie';

  constructor(private _httpClient: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getMovies(search: string, idNumber: string): Observable<MovieLight[]> {
    let params = new HttpParams();
    params = params.append('search', search);
    params = params.append('idNumber', idNumber);

    return this._httpClient.get<MovieLight[]>(this.rentedMoviesUrl + "/Search", {params: params});
  }

  getShowMovies(movies: any): Observable<MovieLight[]> {
    let params = new HttpParams();
    movies.forEach((element: number) => {
      params = params.append('movies', element);
    });

    return this._httpClient.get<MovieLight[]>(this.rentedMoviesUrl + "/Show", {params: params});
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
    let movies: Array<number> = [];
    selectedMovies.forEach(element => {
      movies.push(element);
    });

    return this._httpClient.post<boolean>(this.rentedMoviesUrl, {movies, selectedIDnumber}, this.httpOptions);
  }

  returnMovies(selectedMovies: any[], selectedIDnumber: string): Observable<boolean> {
    let movies = selectedMovies.map(item => item.movieId);

    return this._httpClient.put<boolean>(this.rentedMoviesUrl + "/Return", {movies, selectedIDnumber}, this.httpOptions);
  }
}
