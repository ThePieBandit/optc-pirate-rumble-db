import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { types } from 'src/app/core/constants/units';
import { typeImage } from 'src/app/core/utils/images';

interface UnitType {
  name: string;
  img: string;
}

@Component({
  selector: 'app-type-picker',
  templateUrl: './type-picker.component.html',
  styleUrls: ['./type-picker.component.css']
})
export class TypePickerComponent implements OnInit {

  @Output()
  public classChange: EventEmitter<string[]> = new EventEmitter<string[]>();

  @Input()
  public type: string[] = [];

  types: UnitType[] = types.map(type => ({
    name: type,
    img: typeImage(type)
  }));

  constructor() {
  }

  ngOnInit(): void {
  }

  change(): void {
    this.classChange.emit(this.type);
  }

}
