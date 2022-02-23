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
  avatar: string;
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

    let src = URL.createObjectURL(files[0]);
    this.compressImage(src, 200).then(compressed => {
      this.avatar = compressed as string;
    });
  }

  compressImage(src: string, maxSideLength: number) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.src = src;

      img.onload = () => {
        if(img.width < maxSideLength && img.height < maxSideLength) {
          res(src);
        }

        let newX = 0, newY = 0;

        newX = maxSideLength / img.height * img.width;
        newY = maxSideLength;

        const elem = document.createElement('canvas');
        elem.width = newX;
        elem.height = newY;
        const ctx = elem.getContext('2d');
        ctx!.drawImage(img, 0, 0, newX, newY);
        const data = ctx!.canvas.toDataURL();
        res(data);
      }
      img.onerror = error => rej(error);
    })
  }

  addMovie() {
    this.movie.caption = this.addForm.controls['caption'].value;
    this.movie.releaseYear = this.addForm.controls['releaseYear'].value;
    this.movie.movieLength = this.addForm.controls['movieLength'].value;
    this.movie.quantity = this.addForm.controls['quantity'].value;
    this.movie.avatar = this.avatar;

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
