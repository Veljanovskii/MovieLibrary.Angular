import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Movie } from '../models/Movie';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  moviesList: Movie[] = [];


  constructor() { }

  ngOnInit() {
    this.firstFormGroup = new FormGroup({
      firstCtrl: new FormControl('', [Validators.required]),
    });
    this.secondFormGroup = new FormGroup({
      secondCtrl: new FormControl('', [Validators.required]),
    });


    let movie1 = {"caption": "The Wolf of Wallstreet"} as Movie;
    let movie2 = {"caption": "The Matrix"} as Movie;
    let movie3 = {"caption": "Avatar"} as Movie;

    console.log(this.moviesList);

    this.moviesList.push(movie1);
    this.moviesList.push(movie2);
    this.moviesList.push(movie3);
  }

}
