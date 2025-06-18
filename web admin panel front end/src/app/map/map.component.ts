import { Component, OnInit } from '@angular/core';
import { google } from 'google-maps';

@Component({
  selector: 'app-google-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  private map!: google.maps.Map;
  private marker!: google.maps.Marker;

  constructor() { }

  ngOnInit(): void {
    this.initMap();
  }

  initMap(): void {
    const myLatLng = { lat: 7.8731, lng: 80.7718 };

    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: myLatLng,
      zoom: 8
    });

    this.marker = new google.maps.Marker({
      position: myLatLng,
      map: this.map,
      title: 'Sri Lanka'
    });

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        const userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        this.marker.setPosition(userLatLng);
        this.map.setCenter(userLatLng);
      });
    }
  }
}
