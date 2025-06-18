import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css']
})
export class HotelsComponent implements OnInit {
  hotels: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchHotels();
  }

  fetchHotels() {
    this.http.get<any>('http://localhost:3000/hotels').subscribe(data => {
      this.hotels = data;
    });
  }
}
