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
      filterChain.push(unit => formFields.type.value.includes(unit.type));
    }
    if ( Array.isArray(formFields.class.value) && formFields.class.value.length){
      filterChain.push(unit => formFields.class.value.includes(unit.class1) || formFields.class.value.includes(unit.class2));
    }
    if ( Array.isArray(formFields.rumbleType.value) && formFields.rumbleType.value.length){
      filterChain.push(unit => formFields.rumbleType.value.includes(unit.rumbleType));
    }
    return filterChain;
  }

}
