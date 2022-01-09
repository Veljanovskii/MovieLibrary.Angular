import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MovieService } from '../movie.service';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css']
})
export class AddMovieComponent implements OnInit {
  addForm: FormGroup;

  constructor(private movieService: MovieService, public dialogRef: MatDialogRef<AddMovieComponent>) { }

  ngOnInit(): void {
    this.addForm = new FormGroup({
      caption: new FormControl('', [Validators.required]),
      releaseYear: new FormControl(new Date().getFullYear, [Validators.required]),
      movieLength: new FormControl('', [Validators.required])
    });
  }

  addMovie() {
    this.movieService.addMovie(this.addForm.value).subscribe();
  }

  onCancelClick(): void {
    this.dialogRef.close();
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
