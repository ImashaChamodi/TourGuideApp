import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  placeName: string = '';
  placeDetails: any;

  constructor(private route: ActivatedRoute,private http: HttpClient) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.placeName = params['name'];
      this.placeDetails = JSON.parse(params['details']);
      console.log('second',this.placeDetails);
    });
  }

  editDetails() {
    // handle edit logic here
  }

  saveDetails() {
  }
}
