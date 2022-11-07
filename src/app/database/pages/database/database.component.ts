import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.css']
})
export class DatabaseComponent implements OnInit {

  @ViewChild('filters')
  optionsNav: MatSidenav;

  constructor() { }

  ngOnInit(): void {
  }

  onSidenavClose() {
    this.optionsNav.close();
  }
}
