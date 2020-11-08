import { Component, OnInit, Injectable } from '@angular/core';
import { UnitTableDataSource, Unit } from '../unit-table/unit-table-datasource';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  statType = 'RAW';
  statBaseValue = 'LEVEL';
  hideBaseForms = 'true';

  constructor(public dataService: UnitTableDataSource) { }

  ngOnInit(): void {
  }

  handleFormChange(formId: any): void{
    // this.dataService.statBaseSubject.next(formId.form.controls.statBaseValue.value);
    // this.dataService.statTypeSubject.next(formId.form.controls.statType.value);
    this.dataService.filterChainSubject.next(this.computeFilterChain(formId.form.controls));
    this.dataService.filterData();
  }

  computeFilterChain(formFields: any): ((unit: Unit) => boolean ) [] {
    let filterChain: ((unit: Unit) => boolean ) [] = [];
    if (formFields.hideBaseForms.value === 'true')
    {
      filterChain.push(unit => !unit.isBaseForm);
    }
    return filterChain;
  }

}
