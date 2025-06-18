import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import { MatSnackBar } from '@angular/material/snack-bar';
import { google } from 'google-maps';
// import { MouseEvent } from '@angular/core';

interface Place {
  id: string;
  name: string;
  images: string[];
  type: string;
  details:string;
  location: string;
  nearestTown: string;
}

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.css']
})
export class PlaceComponent implements OnInit {

  placeName: string = '';
  placeImages: string[] = [];
  placeType: string = '';
  attractionDetails: string = '';
  location: string = '';
  nearestTown: string = '';

  private map!: google.maps.Map;
  private marker!: google.maps.Marker;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.initMap();
  }

  submitForm() {
    if (!this.placeName || this.placeName.trim() === '' ||
        !this.placeType || this.placeType.trim() === '' ||
        !this.attractionDetails || this.attractionDetails.trim() === '' ||
        !this.location || this.location.trim() === '' ||
        !this.nearestTown || this.nearestTown.trim() === '') {
      // Display an error message or handle the case where any required fields are not filled
      this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
      return;
    }

    const placeData: Place = {
      id: uuidv4(),
      name: this.placeName,
      images: this.placeImages,
      type: this.placeType,
      details: this.attractionDetails,
      location: this.location,
      nearestTown: this.nearestTown
    };

    this.http.post<Place>('http://localhost:3000/places', placeData).subscribe(response => {
      console.log(response);
      this.snackBar.open('Place added successfully', 'Close', { duration: 3000 });
    });

    this.clearFields();
  }


  // handleImageInput(event: any) {
  //   // handle image input logic here
  // }

  clearFields() {
    this.placeName = '';
    this.placeImages = [];
    this.placeType = '';
    this.attractionDetails  = '';
    this.location = '';
    this.nearestTown = '';
  }

  initMap(): void {
  const myLatLng = { lat: 7.8731, lng: 80.7718 };

  this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
    center: myLatLng,
    zoom: 8
  });

  // Define the marker icon for existing places
  const existingPlaceMarker = {
    url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
  };

 // Fetch the places data from the API
this.http.get<Place[]>('http://localhost:3000/places').subscribe(places => {
  places.forEach(place => {
    const latLng = place.location.split(',').map(Number);

    const marker = new google.maps.Marker({
      position: { lat: latLng[0], lng: latLng[1] },
      map: this.map,
      title: place.name,
      icon: existingPlaceMarker
    });

    // Add an info window for the marker
    const infoWindow = new google.maps.InfoWindow({
      content: `<div><h4>${place.name}</h4><p>${place.details}</p></div>` // Change 'description' to 'attractionDetails'
    });

    marker.addListener('click', () => {
      infoWindow.open(this.map, marker);
    });
  });
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
      this.location = `${position.coords.latitude},${position.coords.longitude}`;
    });
  }
}

  markLocation() {
    this.marker = new google.maps.Marker({
      position: this.map.getCenter(),
      map: this.map,
      draggable: true
    });

    google.maps.event.addListener(this.marker, 'dragend', (event: any) => {
      this.location = `${event.latLng.lat()},${event.latLng.lng()}`;
    });
  }
  removeImage(index: number) {
    this.placeImages.splice(index, 1);
  }
  handleImageInput(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.placeImages.push(e.target.result);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }
}
