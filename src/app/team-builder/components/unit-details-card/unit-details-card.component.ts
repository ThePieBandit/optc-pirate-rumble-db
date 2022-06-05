import { Component, Input, OnInit } from '@angular/core';
import { UnitDetails } from '@shared/models/unit-details';
import { classImage, typeImage, rumbleTypeImage } from 'src/app/core/utils/images';

export interface UnitAttribute {
  img: string;
  desc: string;
}

type CombatStat = {
  key: string;
  value: string;
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
  combatStats: CombatStat[];

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

    this.combatStats = Object.keys(other)
      .map(k => ({key: k, value: other[k]}))
      .filter(s => s.value);
      
    this.combatStats.sort((a, b) => a.key > b.key ? 1 : (a.key < b.key ? -1 : 0));
  }

  ngOnInit(): void {
  }

}
