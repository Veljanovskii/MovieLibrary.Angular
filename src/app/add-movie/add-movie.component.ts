import { Component, forwardRef, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MovieService } from '../movie.service';
import { MatDatepicker } from '@angular/material/datepicker';
import { Movie } from '../Movie';
import { MAT_DATE_FORMATS } from '@angular/material/core';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css'],
})
export class AddMovieComponent implements OnInit {
  addForm: FormGroup;
  movie = <Movie>{};

  constructor(private movieService: MovieService, public dialogRef: MatDialogRef<AddMovieComponent>) { }

  ngOnInit(): void {
    this.addForm = new FormGroup({
      caption: new FormControl('', [Validators.required]),
      releaseYear: new FormControl('', [Validators.required]),
      movieLength: new FormControl('', [Validators.required])
    });
  }

  addMovie() {
    this.movie.caption = this.addForm.controls['caption'].value;
    this.movie.releaseYear = this.addForm.controls['releaseYear'].value.getFullYear();
    this.movie.movieLength = this.addForm.controls['movieLength'].value;
    this.movie.insertDate = new Date();

    this.movieService.addMovie(this.movie).subscribe();
  }

  getCaptionErrorMessage() {
    if (this.addForm.controls['caption'].hasError('required')) {
      return 'You must enter Movie caption';
    }

    return this.addForm.hasError('') ? 'You must enter a value' : '';
  }

  getReleaseErrorMessage() {
    if (this.addForm.controls['releaseYear'].hasError('required')) {
      return 'You must enter Movie release year';
    }

    return this.addForm.hasError('') ? 'You must enter a value' : '';
  }

  getLengthErrorMessage() {
    if (this.addForm.controls['movieLength'].hasError('required')) {
      return 'You must enter Movie length';
    }

    return this.addForm.hasError('') ? 'You must enter a value' : '';
  }
}
