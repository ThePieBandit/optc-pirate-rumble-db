import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import UnitService from 'src/app/core/services/unit.service';
import * as rumble from '../../../shared/models/rumble';
import { UnitPickerComponent, UnitPickerData } from '../../components/unit-picker/unit-picker.component';
import { isTeamEffect, buffAppliesToTime, isHpBasedEffect, effectAppliesToUnitHp } from '../../../core/utils/effects';
import { battleTime } from '../../../core/constants/battle';
import { TeamTotals } from '../../models/team-totals';
import { MatSliderChange } from '@angular/material/slider';
import { TeamUnit } from '../../models/team-unit';

const mainTeamSize = 5;
const subTeamSize = 3;

@Component({
  selector: 'app-team-builder',
  templateUrl: './team-builder.component.html',
  styleUrls: ['./team-builder.component.css']
})
export class TeamBuilderComponent implements OnInit {

  initialBattleTime = battleTime;
  mainTeam: TeamUnit[];
  subTeam: TeamUnit[];
  units: rumble.Unit[];
  battleTimer: number;
  teamEffects: rumble.Effect[];
  totals: TeamTotals;

  constructor(
    private dialog: MatDialog,
    dataSource: UnitService,
  ) {
    this.battleTimer = this.initialBattleTime;

    this.totals = {
      cost: 0,
    };

    this.units = dataSource.getUnits();

    this.mainTeam = [];
    for (let index = 1; index <= mainTeamSize; index++) {
      this.mainTeam.push(null);
    }

    this.subTeam = [];
    for (let index = 1; index <= subTeamSize; index++) {
      this.subTeam.push(null);
    }

    this.teamEffects = [];
  }

  private createTeamUnit(unit: rumble.Unit): TeamUnit {
    if (!unit) {
      return null;
    }
    return Object.assign(unit, {
      hp: 100,
    });
  }

  private buffApplies(effect: rumble.Effect, unit: TeamUnit, time?: number): boolean {
    return buffAppliesToTime(effect, time || this.battleTimer) &&
      effectAppliesToUnitHp(effect, unit.hp);
  }

  ngOnInit(): void {
  }

  updateCost(): void {
    // update totals.cost based on main/sub team current state
  }

  updateBuffs(time?: number): void {
    this.teamEffects = this.mainTeam
      .filter(unit => unit != null && unit.lvl5Ability != null)
      .flatMap(unit => unit.lvl5Ability.filter(e => isTeamEffect(e) && this.buffApplies(e, unit, time)))
    ;
  }

  updateDebuffs(time?: number): void {
    // update totals.debuffs based on main team current state
  }

  mainTeamUnitClick(index: number): void {
    this.openUnitPicker(this.mainTeam[index], (data) => {
      this.mainTeam[index] = this.createTeamUnit(data);
      this.updateBuffs();
      this.updateDebuffs();
      this.updateCost();
    });
  }

  subTeamUnitClick(index: number): void {
    this.openUnitPicker(this.subTeam[index], (data) => {
      this.subTeam[index] = this.createTeamUnit(data);
      this.updateCost();
    });
  }

  openUnitPicker(current: rumble.Unit, onPick: (unit: rumble.Unit) => void): void {
    const dialogConfig = new MatDialogConfig<UnitPickerData>();

    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      team: [...this.mainTeam, ...this.subTeam].filter(u => u != null),
      current,
      units: this.units,
    };

    const dialogRef = this.dialog.open(UnitPickerComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data !== undefined) {
          // allow null so we can unset units
          onPick(data);
        }
      }
    );
  }

  battleTimerChange(event: MatSliderChange): void {
    this.updateBuffs(event.value);
    this.updateDebuffs(event.value);
  }

  unitHpChange(unit: TeamUnit, newHp: number): void {
    if (unit.hp !== newHp) {
      console.warn('they are different!!!!!!!!!!!!!!!!');
    }
    if (unit.lvl5Ability.some(e => isHpBasedEffect(e))) {
      this.updateBuffs(this.battleTimer);
      this.updateDebuffs(this.battleTimer);
    }
  }
}
