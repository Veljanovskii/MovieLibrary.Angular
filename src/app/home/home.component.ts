import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectionList } from '@angular/material/list';
import { MatStepper } from '@angular/material/stepper';
import { catchError, debounceTime, merge, startWith, switchMap, of as observableOf, map } from 'rxjs';
import { Movie } from '../models/Movie';
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
  rentedSuccessfull: string;

  fetchedMoviesList: Movie[] = [];

  constructor(private rentMovieService: RentMovieService) { }

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

        if(this.selectedMovies) {
          let filtered = Object.values(this.selectedMovies).filter((value, index, self) =>
          index === self.findIndex((t) => (
            t.movieId === value.movieId
            ))
          );

          this.firstFormGroup.controls["selectedMovies"].setValue(filtered);
        }
      });
    }

    public get selectedMovies(): any[] {
      return this.firstFormGroup.controls["selectedMovies"].value;
    }

    public get selectedIDnumber(): string {
      return this.secondFormGroup.controls["IDnumber"].value;
    }

     view() {
      // console.log(this.selectedMovies);
      // let unique = Object.values(this.selectedMovies).filter((value, index, self) =>
      //   index === self.findIndex((t) => (
      //     t.movieId === value.movieId
      //   ))
      // )
      // console.log(unique);
      // this.firstFormGroup.controls["selectedMovies"].setValue(unique);
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
      this.isLoadingResults = true;
      this.rentMovieService.rentMovies(this.selectedMovies, this.selectedIDnumber).subscribe((data) => {
        if(data) {
          this.rentedSuccessfull = "Rent successful!"
          this.delay(2500).then(() => {
            this.stepperRent.reset();
            this.isLoadingResults = false;
          });
          this.errorMessage = "";
        }
        else {
          this.errorMessage = "Unable to rent.";
          this.rentedSuccessfull = "";
        }
      });
    }

    onRentStepChange(event: any): void {
      if (event.selectedIndex == 2) {
        this.errorMessage = "";
        this.rentedSuccessfull = "";
      }
    }

    onReturnStepChange(event: any): void {
      if(event.selectedIndex == 1) {
        this.getRented();
      }
      else if (event.selectedIndex == 2) {
        this.errorMessage = "";
        this.rentedSuccessfull = "";
      }
    }

    getRented(): void {
      this.rentMovieService!.getRented(this.selectedIDnumber).subscribe((data) => {
        this.fetchedMoviesList = data
      });
    }

    returnMovies(): void {
      this.isLoadingResults = true;
      let movieList: Movie[] = [];
      this.selection.selectedOptions.selected.forEach(element => {
        movieList.push(element.value);
      });
      this.rentMovieService.returnMovies(movieList, this.selectedIDnumber).subscribe((data) => {
        if(data) {
          this.rentedSuccessfull = "Return successful!"
          this.delay(2500).then(() => {
          this.stepperReturn.reset();
          this.isLoadingResults = false;
          });
          this.errorMessage = "";
        }
        else {
          this.errorMessage = "Unable to return.";
          this.rentedSuccessfull = "";
        }
      });
    }
}
