import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { User } from './models/User';
import { UsersCount } from './models/UsersCount';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersUrl = 'https://localhost:44371/api/User';

  constructor(private _httpClient: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getUsers(sort: string, order: SortDirection, page: number, size:number, search:string): Observable<UsersCount> {
    let params = new HttpParams();
    params = params.append('sort', sort);
    params = params.append('order', order);
    params = params.append('page', page);
    params = params.append('size', size);
    params = params.append('search', search);

    return this._httpClient.get<UsersCount>(this.usersUrl, {params: params});
  }

  addUser(user: User): Observable<User> {
    return this._httpClient.post<User>(this.usersUrl, user, this.httpOptions);
  }

  editUser(user: User): Observable<any> {
    return this._httpClient.put(this.usersUrl, user, this.httpOptions);
  }

  deleteUser(id: number): Observable<User> {
    const target = `${this.usersUrl}/${id}`;

    return this._httpClient.delete<User>(target, this.httpOptions);
  }
}
