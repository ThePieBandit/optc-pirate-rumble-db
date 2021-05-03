import { Component, Input, OnInit } from '@angular/core';
import { UnitDetails } from '@shared/models/unit-details';
import { classImage, typeImage } from 'src/app/core/utils/images';

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
  private _unit: UnitDetails;

  @Input()
  get unit(): UnitDetails {
    return this._unit;
  }

  set unit(value: UnitDetails) {
    this._unit = value;
    this.setAttributes(value);
  }

  attributes: UnitAttribute[];

  constructor() {
    this.attributes = [];
  }

  private setAttributes(unit: UnitDetails): void {
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
