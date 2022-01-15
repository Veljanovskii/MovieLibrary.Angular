import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Actions } from 'src/app/models/Actions';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  dialogForm: FormGroup;
  action: Actions;
  user = <User>{};
  index: number;
  validStatus: Array<string> = ['Single', 'Married', 'Divorced', 'Widowed'];

  constructor(private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.action = data.action;

      if(this.action == Actions.Add) {
        this.dialogForm = new FormGroup({
          firstName: new FormControl('', [Validators.required]),
          lastName: new FormControl('', [Validators.required]),
          address: new FormControl('', [Validators.required]),
          idnumber: new FormControl('', [Validators.required]),
          maritalStatus: new FormControl('', [Validators.required])
        });
      }

      if(this.action == Actions.Edit) {
        this.user = data.obj;

        this.dialogForm = new FormGroup({
          firstName: new FormControl(this.user.firstName, [Validators.required]),
          lastName: new FormControl(this.user.lastName, [Validators.required]),
          address: new FormControl(this.user.address, [Validators.required]),
          idnumber: new FormControl(this.user.idnumber, [Validators.required]),
          maritalStatus: new FormControl(this.user.maritalStatus, [Validators.required])
        });
      }

      if(this.action == Actions.Delete) {
        this.index = data.obj;
      }

    }

  ngOnInit(): void { }

  onSubmit() {
    if(this.action == Actions.Add) {
      this.addUser();
    }

    if(this.action == Actions.Edit) {
      this.editUser();
    }

    if(this.action == Actions.Delete) {
      this.deleteUser();
    }

  }

  addUser() {
    this.userService.addUser(this.dialogForm.value).subscribe();
  }

  editUser() {
    this.user.firstName = this.dialogForm.controls['firstName'].value;
    this.user.lastName = this.dialogForm.controls['lastName'].value;
    this.user.address = this.dialogForm.controls['address'].value;
    this.user.idnumber = this.dialogForm.controls['idnumber'].value;
    this.user.maritalStatus = this.dialogForm.controls['maritalStatus'].value;

    this.userService.editUser(this.user).subscribe();
  }

  deleteUser() {
    this.userService.deleteUser(this.index).subscribe();
  }

  getFirstNameErrorMessage() {
    if (this.dialogForm.controls['firstName'].hasError('required')) {
      return 'You must enter User first name';
    }

    return this.dialogForm.hasError('') ? 'You must enter a value' : '';
  }

  getLastNameErrorMessage() {
    if (this.dialogForm.controls['lastName'].hasError('required')) {
      return 'You must enter User last name';
    }

    return this.dialogForm.hasError('') ? 'You must enter a value' : '';
  }

  getAddressErrorMessage() {
    if (this.dialogForm.controls['address'].hasError('required')) {
      return 'You must enter User address';
    }

    return this.dialogForm.hasError('') ? 'You must enter a value' : '';
  }

  getIDErrorMessage() {
    if (this.dialogForm.controls['idnumber'].hasError('required')) {
      return 'You must enter User ID number';
    }

    return this.dialogForm.hasError('') ? 'You must enter a value' : '';
  }

  getStatusErrorMessage() {
    if (this.dialogForm.controls['maritalStatus'].hasError('required')) {
      return 'You must enter User marital status';
    }

    return this.dialogForm.hasError('') ? 'You must enter a value' : '';
  }

}
