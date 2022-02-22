import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectionList } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { catchError, debounceTime, merge, startWith, switchMap, of as observableOf, map, Subject, Observable } from 'rxjs';
import { Movie } from '../models/Movie';
import { MovieLight } from '../models/MovieLight';
import { RentMovieService } from '../services/rent-movie.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  isLinear = true;
  rentDialog = true;
  @ViewChild("stepperRent", { static: false }) stepperRent: MatStepper;
  @ViewChild("stepperReturn", { static: false }) stepperReturn: MatStepper;
  @ViewChild("selection", { static: false }) selection: MatSelectionList;

  firstFormGroup = new FormGroup({
      search: new FormControl('', [Validators.required]),
      selectedMovies: new FormControl('', [Validators.required]),
    });

  secondFormGroup = new FormGroup({
      IDnumber: new FormControl('', [Validators.required])
    });

  isLoadingResults = true;
  isRateLimitReached = false;
  errorMessage: string;
  fetchedMoviesList: MovieLight[] = [];
  showMovies: MovieLight[] = [];

  constructor(private rentMovieService: RentMovieService, private _snackBar: MatSnackBar) { }

  ngAfterViewInit() {
      merge(this.firstFormGroup.controls["search"].valueChanges.pipe(debounceTime(400)))
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.rentMovieService!.getMovies(
            this.firstFormGroup.controls["search"].value, this.selectedIDnumber
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          return data;
        }),
      )
      .subscribe(data => {
        this.fetchedMoviesList = data;
      });
    }

    public get selectedMovies(): any[] {
      return this.firstFormGroup.controls["selectedMovies"].value;
    }

    public get selectedIDnumber(): string {
      return this.secondFormGroup.controls["IDnumber"].value;
    }

    nextRentStep(): void {
      this.stepperRent.linear = false;
      this.stepperRent.next();
      setTimeout(() => {
        this.stepperRent.linear = true;
      });
    }

    previousRentStep(): void {
      this.stepperRent.linear = false;
      this.stepperRent.previous();
      setTimeout(() => {
        this.stepperRent.linear = true;
      });
    }

    nextReturnStep(): void {
      this.stepperReturn.linear = false;
      this.stepperReturn.next();
      setTimeout(() => {
        this.stepperReturn.linear = true;
      });
    }

    previousReturnStep(): void {
      this.stepperReturn.linear = false;
      this.stepperReturn.previous();
      setTimeout(() => {
        this.stepperReturn.linear = true;
      });
    }

    delay(time: number) {
      return new Promise(resolve => setTimeout(resolve, time));
    }

    checkValidUser(): void {
      if (this.secondFormGroup.invalid) {
        return;
      }

      this.rentMovieService!.checkValidUser(this.selectedIDnumber).subscribe((data) => {
        if(data) {
          if(this.rentDialog) {
            this.nextRentStep();
          }
          else {
            this.nextReturnStep();
          }
          this.errorMessage = "";
        }
        else {
          this.errorMessage = "User not found.";
        }
      });
    }

    rentMovies(): void {
      this.rentMovieService.rentMovies(this.selectedMovies, this.selectedIDnumber).subscribe((data) => {
        if(data) {
          this._snackBar.open("Rent successful", "OK", {
            duration: 5000,
            panelClass: "snackbar-success"
          });
          this.stepperRent.reset();
        }
        else {
          this._snackBar.open("Unable to rent", "OK", {
            duration: 5000,
            panelClass: "snackbar-error"
          });
        }
      });
    }

    onRentStepChange(event: any): void {
      if (event.selectedIndex == 2) {

        this.rentMovieService.getShowMovies(this.selectedMovies).subscribe((data) => {
          this.showMovies = data;
        })

        this.errorMessage = "";
      }
    }

    onReturnStepChange(event: any): void {
      if(event.selectedIndex == 1) {
        this.getRented();
      }
      else if (event.selectedIndex == 2) {
        this.errorMessage = "";
      }
    }

    getRented(): void {
      this.rentMovieService!.getRented(this.selectedIDnumber).subscribe((data) => {
        this.fetchedMoviesList = data
      });
    }

    returnMovies(): void {
      let movieList: Movie[] = [];
      this.selection.selectedOptions.selected.forEach(element => {
        movieList.push(element.value);
      });
      this.rentMovieService.returnMovies(movieList, this.selectedIDnumber).subscribe((data) => {
        if(data) {
          this._snackBar.open("Return successful", "OK", {
            duration: 5000
          });
          this.stepperReturn.reset();
        }
        else {
          this._snackBar.open("Return successful", "OK", {
            duration: 5000
          });
        }
      });
    }
}
