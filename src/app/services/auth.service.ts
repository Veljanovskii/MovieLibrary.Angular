import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, EMPTY, map, Observable, switchMap, tap } from 'rxjs';
import { Employee } from '../models/Employee';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = 'https://localhost:44371/api/Login';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private employeeSubject: BehaviorSubject<Employee | null>;
  public employee: Observable<Employee | null>;

  constructor(private _httpClient: HttpClient, private router: Router) {
        this.employeeSubject = new BehaviorSubject<Employee | null>(JSON.parse(localStorage.getItem('employee') as string));
        this.employee = this.employeeSubject.asObservable();
   }

   public get employeeValue(): Employee | null {
    return this.employeeSubject.value;
  }

  login(credentials: any): Observable<any> {
    return this._httpClient.post<any>(this.loginUrl, {
      email: credentials.email,
      password: credentials.password
    }, this.httpOptions).pipe(
        map(employee => {
          console.log(employee);
          localStorage.setItem("employee", JSON.stringify(employee));
          this.employeeSubject.next(employee);
          return employee;
      }));
  }

  logOut() {
    console.log(this.employeeValue?.id);
    localStorage.removeItem('employee');
    this.employeeSubject.next(null);
    this.router.navigate(['/login']);
  }
}
