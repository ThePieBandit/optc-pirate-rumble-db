import { Component, OnInit } from '@angular/core';
import { DataService, Unit } from '../data.service';

@Component({
  selector: 'app-option-bar',
  templateUrl: './option-bar.component.html',
  styleUrls: ['./option-bar.component.css']
})
export class OptionBarComponent implements OnInit {

  statType = 'RAW';
  statBaseValue = 'LEVEL';

  constructor(public dataService: DataService) { }

  ngOnInit(): void {
  }

  onSubmit(formId: any): void{
    this.dataService.statBaseSubject.next(formId.form.controls.statBaseValue.value);
    this.dataService.statTypeSubject.next(formId.form.controls.statType.value);
  }

}
