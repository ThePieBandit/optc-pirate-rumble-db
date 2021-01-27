import { Component, OnInit, Injectable } from '@angular/core';
import { UnitTableDataSource } from '../unit-table/unit-table-datasource';
import { Unit } from '../model/rumble';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  statType = 'RAW';
  statBaseValue = 'LEVEL';
  hideBaseForms = 'true';
  type = '';
  class = '';
  rumbleType = '';

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
    const filterChain: ((unit: Unit) => boolean ) [] = [];
    if (formFields.hideBaseForms.value === 'true')
    {
      filterChain.push(unit => !unit.isBaseForm);
    }
    if ( Array.isArray(formFields.type.value) && formFields.type.value.length){
      filterChain.push(unit => formFields.type.value.includes(unit.stats.type));
    }
    if ( Array.isArray(formFields.class.value) && formFields.class.value.length){
      filterChain.push(unit => formFields.class.value.includes(unit.stats.class1) || formFields.class.value.includes(unit.stats.class2));
    }
    if ( Array.isArray(formFields.rumbleType.value) && formFields.rumbleType.value.length){
      filterChain.push(unit => formFields.rumbleType.value.includes(unit.stats.rumbleType));
    }
    return filterChain;
  }

}
