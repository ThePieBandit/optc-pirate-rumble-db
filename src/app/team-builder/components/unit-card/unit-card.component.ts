import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import * as rumble from '../../../shared/models/rumble';
import { buffAppliesToTime, buffAppliesToUnit, effectAppliesToUnitHp } from '../../../core/utils/effects';
import { TeamUnit } from '../../models/team-unit';
import { MatSliderChange } from '@angular/material/slider';
import { buffs } from 'src/app/core/constants/effects';
import { effectImage } from 'src/app/core/utils/images';
import { battleTime } from '@core/constants/battle';
import { LocalStorage } from 'ngx-store';

interface UnitBuff {
  name: rumble.Attribute;
  img: string;
  value: number;
}

@Component({
  selector: 'app-unit-card',
  templateUrl: './unit-card.component.html',
  styleUrls: ['./unit-card.component.css']
})
export class UnitCardComponent implements OnInit {

  @LocalStorage()
  showAllBuffs: boolean;

  @Input()
  public unit: TeamUnit;

  @Input()
  public compact = false;

  // tslint:disable-next-line:variable-name
  private _teamEffects: rumble.Effect[];

  @Input()
  set teamEffects(value: rumble.Effect[]) {
    this._teamEffects = value;
    if (this.unit) {
      this.updateBuffs();
    }
  }

  // tslint:disable-next-line:variable-name
  private _battleTimer: number;

  @Input()
  get battleTimer(): number {
    return this._battleTimer;
  }

  set battleTimer(value: number) {
    this._battleTimer = value;
    if (this.unit) {
      this.updateBuffs();
      this.updateCooldown();
    }
  }

  @Input()
  style?: 'red' | 'blue' | 'gp';

  @Output()
  public unitClick = new EventEmitter<boolean>();

  @Output()
  public hpChange = new EventEmitter<number>();

  leaderIcon = 'assets/images/pirate_hat.png';
  defaultImage = 'assets/images/recruit_wanted.png';
  buffs: UnitBuff[];

  constructor() {
    this.buffs = buffs.map(b => ({
      name: b,
      img: effectImage(b),
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
    this.updateMaxCooldown();
  }

  private updateMaxCooldown(): void {
    // https://www.reddit.com/r/OnePieceTC/comments/ixfckf/pirate_festival_stats_debuffs_and_other_inbattle/
    // For example, level 10 CT means 20% CTR.
    // V1 Snakeman who has a 40 CT special will only take
    // 40 x 80% = 32 seconds to charge it instead of 40.
    const ctBuff = this.buffs.find(b => b.name === 'Special CT')?.value;
    if (ctBuff == null) {
      console.warn('could not find Special CT buff', JSON.stringify(this.buffs));
      return;
    }
    const ctr = (100 - (ctBuff * 20 / 10)) / 100;
    this.unit.maxCooldown = this.unit.lvl10Cooldown * ctr;
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
      if (e.effect === 'penalty' || e.effect === 'debuff') {
        unitBuff.value -= e.level;
      } else {
        unitBuff.value += e.level;
      }
    });
  }

  private updateCooldown(): void {
    const elapsed = battleTime - this._battleTimer;
    this.unit.cooldown = Math.min(elapsed, this.unit.maxCooldown);
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
