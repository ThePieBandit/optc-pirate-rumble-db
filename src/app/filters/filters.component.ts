import { Component, OnInit, Injectable } from '@angular/core';
import { DataService, Unit } from '../data.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  hideBaseForms:boolean = true;

  constructor(public dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.filterChainSubject.next(hideBaseForms);
  }

  onSubmit(formId: any): void{
    this.dataService.filterChainSubject.next(formId.form.controls.hideBaseForms.value);

  }
}
