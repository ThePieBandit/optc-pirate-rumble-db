import { Component, Input, OnInit } from '@angular/core';
import { UnitDetails } from '@shared/models/unit-details';
import { classImage, typeImage, rumbleTypeImage } from 'src/app/core/utils/images';

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

    const { type, class1, class2, rumbleType, ...other } = unit.stats;

    this.attributes = [
      {
        img: typeImage(type),
        desc: type
      },
      {
        img: classImage(class1),
        desc: class1
      }
    ];
    if (class2) {
      this.attributes.push({
        img: classImage(class2),
        desc: class2
      });
    }
    if (rumbleType) {
      this.attributes.push({
        img: rumbleTypeImage(rumbleType),
        desc: rumbleType,
      });
    }
  }

  ngOnInit(): void {
  }

}
