import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, debounceTime, map, merge, of as observableOf, startWith, Subject, switchMap } from 'rxjs';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/user.service';
import { DialogComponent } from 'src/app/user/dialog/dialog.component';
import { Actions } from 'src/app/models/Actions'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements AfterViewInit {

  displayedColumns: string[] = ['FirstName', 'LastName', 'Address', 'Idnumber', 'MaritalStatus', 'InsertDate', 'Options'];
  data: User[] = [];
  search = new FormControl('');
  loadUsers: Subject<any> = new Subject();
  dialogAction =  Actions;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private userService: UserService,
    public dialog: MatDialog) { }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page, this.search.valueChanges.pipe(debounceTime(800)), this.loadUsers)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.userService!.getUsers(
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

          this.resultsLength = data.totalUsers;
          return data.users;
        }),
      )
      .subscribe(data => (this.data = data));
  }

  openDialog(action: Actions, obj: any) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '375px',
      data: {
        action: action,
        obj: obj
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == true) {
        this.loadUsers.next(null);
      }
    });
  }

}
