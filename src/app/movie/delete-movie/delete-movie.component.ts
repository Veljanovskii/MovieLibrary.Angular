import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MovieService } from '../../movie.service';

@Component({
  selector: 'app-delete-movie',
  templateUrl: './delete-movie.component.html',
  styleUrls: ['./delete-movie.component.css']
})
export class DeleteMovieComponent implements OnInit {
  index: number;

  constructor(private movieService: MovieService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.index = data.index;
     }

  ngOnInit(): void {
  }

  deleteMovie() {
    this.movieService.deleteMovie(this.index).subscribe();
  }

}
