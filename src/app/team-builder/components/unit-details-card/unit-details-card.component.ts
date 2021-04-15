import { Component, Input, OnInit } from '@angular/core';
import { classImage, typeImage } from 'src/app/core/utils/images';
import * as rumble from '../../../shared/models/rumble';

export interface UnitAttribute {
  img: string;
  desc: string;
}

@Component({
  selector: 'app-unit-details-card',
  templateUrl: './unit-details-card.component.html',
  styleUrls: ['./unit-details-card.component.css']
})
export class UnitDetailsCardComponent implements OnInit {

  // tslint:disable-next-line:variable-name
  private _unit: rumble.Unit;

  @Input()
  get unit(): rumble.Unit {
    return this._unit;
  }

  set unit(value: rumble.Unit) {
    this._unit = value;
    this.setAttributes(value);
  }

  attributes: UnitAttribute[];

  constructor() {
    this.attributes = [];
  }

  private setAttributes(unit: rumble.Unit): void {
    if (!unit.stats) {
      this.attributes = [];
      return;
    }

    this.attributes = [
      {
        img: typeImage(unit.stats.type),
        desc: unit.stats.type
      },
      {
        img: classImage(unit.stats.class1),
        desc: unit.stats.class1
      }
    ];
    if (unit.stats.class2) {
      this.attributes.push({
        img: classImage(unit.stats.class2),
        desc: unit.stats.class2
      });
    }
  }

  ngOnInit(): void {
  }

}
