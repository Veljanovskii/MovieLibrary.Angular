import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { first } from 'rxjs';
import { Employee } from 'src/app/models/Employee';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() public sidenavToggle = new EventEmitter();
  employee: Employee;
  employeeFromApi: Employee;

  constructor(public authService: AuthService, private employeeService: EmployeeService) {
    this.employee = this.authService.employeeValue as Employee;
  }

  ngOnInit(): void {
    // console.log(this.employee.id);
    // this.employeeService.getEmployee(this.employee.id).pipe(first()).subscribe(employee => {
    //   this.employeeFromApi = employee;
    // })
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

  logout() {
    this.authService.logOut();
  }

}
