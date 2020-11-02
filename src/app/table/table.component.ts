import { Component, OnInit } from '@angular/core';
import { DataService, Unit } from '../data.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  units: Array<Unit>;

  computedStats: boolean;

  constructor(public dataService: DataService) {

  }

  ngOnInit(): void {
    this.dataService.statBaseSubject.subscribe( value => {
      this.computedStats = 'LB' === value;
      console.log(value);
      this.refreshUnits();
    });  }

  private refreshUnits(): void {
    this.units = !this.computedStats ?  this.dataService.getPFDetails() : this.dataService.getPFDetails().filter(unit => unit.id < 20);
  }

}
