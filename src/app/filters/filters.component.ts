import { Component, OnInit, Injectable } from '@angular/core';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class FiltersComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
