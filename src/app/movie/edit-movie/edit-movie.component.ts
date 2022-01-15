import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MovieService } from 'src/app/movie.service';
import { Movie } from 'src/app/models/Movie';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-edit-movie',
  templateUrl: './edit-movie.component.html',
  styleUrls: ['./edit-movie.component.css']
})
export class EditMovieComponent implements OnInit {
  editForm: FormGroup;
  movie: Movie;

  constructor(
    private movieService: MovieService,
    public dialogRef: MatDialogRef<EditMovieComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.movie = data.movie;
     }

  ngOnInit(): void {
    this.editForm = new FormGroup({
      caption: new FormControl(this.movie.caption, [Validators.required]),
      releaseYear: new FormControl(this.movie.releaseYear, [Validators.required]),
      movieLength: new FormControl(this.movie.movieLength, [Validators.required])
    });
  }

  editMovie() {
    this.movie.caption = this.editForm.controls['caption'].value;
    this.movie.releaseYear = this.editForm.controls['releaseYear'].value;
    this.movie.movieLength = this.editForm.controls['movieLength'].value;

    this.movieService.editMovie(this.movie).subscribe();
  }

  chosenYearHandler(any: Date, datepicker: MatDatepicker<any>) {
    this.editForm.controls['releaseYear'].setValue(any.getFullYear());
    datepicker.close();
  }

  getCaptionErrorMessage() {
    if (this.editForm.controls['caption'].hasError('required')) {
      return 'You must enter Movie caption';
    }

    return this.editForm.hasError('') ? 'You must enter a value' : '';
  }

  getReleaseErrorMessage() {
    if (this.editForm.controls['releaseYear'].hasError('required')) {
      return 'You must enter Movie release year';
    }

    return this.editForm.hasError('') ? 'You must enter a value' : '';
  }

  getLengthErrorMessage() {
    if (this.editForm.controls['movieLength'].hasError('required')) {
      return 'You must enter Movie length';
    }

    return this.editForm.hasError('') ? 'You must enter a value' : '';
  }

}
