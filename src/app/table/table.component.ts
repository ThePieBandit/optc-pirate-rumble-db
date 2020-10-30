import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  units;

  constructor(public dataService: DataService) { }

  ngOnInit(): void {
    this.units = this.dataService.getPFDetails();
  }

}
