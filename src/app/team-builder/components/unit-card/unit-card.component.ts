import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import * as rumble from '../../../shared/models/rumble';
import { buffAppliesToTime, buffAppliesToUnit, effectAppliesToUnitHp } from '../../../core/utils/effects';
import { TeamUnit } from '../../models/team-unit';
import { MatSliderChange } from '@angular/material/slider';
import { buffs } from 'src/app/core/constants/effects';
import { buffImage } from 'src/app/core/utils/images';

interface UnitBuff {
  name: string;
  img: string;
  value: number;
}

@Component({
  selector: 'app-unit-card',
  templateUrl: './unit-card.component.html',
  styleUrls: ['./unit-card.component.css']
})
export class UnitCardComponent implements OnInit {

  @Input()
  public unit: TeamUnit;

  // tslint:disable-next-line:variable-name
  private _teamEffects: rumble.Effect[];

  @Input()
  set teamEffects(value: rumble.Effect[]) {
    this._teamEffects = value;
    this.updateBuffs();
  }

  // tslint:disable-next-line:variable-name
  private _battleTimer: number;

  @Input()
  get battleTimer(): number {
    return this._battleTimer;
  }

  set battleTimer(value: number) {
    this._battleTimer = value;
    this.updateBuffs();
  }

  @Output()
  public unitClick = new EventEmitter<boolean>();

  @Output()
  public hpChange = new EventEmitter<number>();

  defaultImage = 'assets/images/recruit_wanted.png';
  buffs: UnitBuff[];

  constructor() {
    this.buffs = buffs.map(b => ({
      name: b,
      img: buffImage(b),
      value: 0,
    }));
  }

  private resetBuffs(): void {
    this.buffs.forEach(b => b.value = 0);
  }

  private updateBuffs(): void {
    this.resetBuffs();
    this._teamEffects
      .filter(e => buffAppliesToUnit(e, this.unit))
      .forEach(e => this.applyBuff(e))
    ;
    this.applySelfBuffs();
  }

  private applySelfBuffs(): void {
    if (!this.unit) {
      return;
    }
    this.unit.lvl5Ability
      .filter(e =>
        e?.targeting?.targets?.some(t => t === 'self') &&
        buffAppliesToTime(e, this._battleTimer) &&
        effectAppliesToUnitHp(e, this.unit.hp))
      .forEach(e => this.applyBuff(e))
      ;
  }

  private applyBuff(e: rumble.Effect): void {
    if (!e || !e.attributes) {
      return;
    }
    console.log('applying effect to ' + this.unit.name, e);
    e.attributes.forEach(a => {
      const unitBuff = this.buffs.find(b => b.name === a);
      if (e.effect === 'penalty') {
        unitBuff.value -= e.level;
      } else {
        unitBuff.value += e.level;
      }
    });
  }

  ngOnInit(): void {
  }

  onClick(): void {
    this.unitClick.emit(true);
  }

  onHpChange(event: MatSliderChange): void {
    this.hpChange.emit(event.value);
  }
}
