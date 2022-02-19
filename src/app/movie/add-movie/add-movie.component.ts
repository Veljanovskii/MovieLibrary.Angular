import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MovieService } from 'src/app/services/movie.service';
import { Movie } from 'src/app/models/Movie';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css'],
})
export class AddMovieComponent implements OnInit {
  addForm: FormGroup;
  movie = <Movie>{};
  message: string;

  constructor(private movieService: MovieService) { }

  ngOnInit(): void {
    this.addForm = new FormGroup({
      caption: new FormControl('', [Validators.required]),
      releaseYear: new FormControl('', [Validators.required]),
      movieLength: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required])
    });
  }

  onChange(event: any) {
    const files = event.target.files;
    if (files.length === 0)
        return;

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
        this.message = "Only images are supported.";
        return;
    }

    this.message = "";

    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
        this.movie.avatar = reader.result as string;
    }
  }

  addMovie() {
    this.movie.caption = this.addForm.controls['caption'].value;
    this.movie.releaseYear = this.addForm.controls['releaseYear'].value;
    this.movie.movieLength = this.addForm.controls['movieLength'].value;
    this.movie.quantity = this.addForm.controls['quantity'].value;

    this.movieService.addMovie(this.movie).subscribe();
  }

  chosenYearHandler(any: Date, datepicker: MatDatepicker<any>) {
    this.addForm.controls['releaseYear'].setValue(any.getFullYear());
    datepicker.close();
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

  getQuantityErrorMessage() {
    if (this.addForm.controls['quantity'].hasError('required')) {
      return 'You must enter Movie quantity';
    }

    return this.addForm.hasError('') ? 'You must enter a value' : '';
  }
}
