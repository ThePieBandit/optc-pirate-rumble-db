import { Component, OnInit } from '@angular/core';
import { DataService, Unit } from '../data.service';
import { FiltersComponent } from '../filters/filters.component';
import { OptionBarComponent } from '../option-bar/option-bar.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  units: Array<Unit>;

  constructor(public dataService: DataService, public filters: FiltersComponent, public options: OptionBarComponent) { }

  ngOnInit(): void {
    this.units = this.dataService.getPFDetails();
  }

  public getUnits():Array<Unit> {
    return this.options.isComputedStats() ?  this.units : this.units.filter(unit => unit.id < 20);
  }


}
