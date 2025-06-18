import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { orderBy } from 'lodash';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css']
})
export class CheckComponent implements OnInit {
  places: any[] = [];
  placesSorted: any[] = [];

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    console.log('Starting GET request...');
    this.http.get<any>('http://localhost:3000/places').subscribe(
      data => {
        console.log('Received data:', data);
        this.places = data;
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  logout() {
    // handle logout logic here
  }

  goToDetails(placeName: string) {
    // Find the selected place by name
    const selectedPlace = this.places.find(place => place.name === placeName);

    if (selectedPlace) {
      // Navigate to the details page with the selected place's ID as a query parameter
      this.router.navigate(['/details'], { queryParams: { id: selectedPlace.id } });
    }
  }
}
