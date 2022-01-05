import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css']
})
export class AddMovieComponent implements OnInit {
  addForm = new FormGroup({
    caption: new FormControl(''),
    releaseYear: new FormControl(''),
    movieLength: new FormControl('')
  });

  constructor(private movieService: MovieService) { }

  ngOnInit(): void {
  }

  addMovie() {
    this.movieService.addMovie(this.addForm.value).subscribe();
  }

}
