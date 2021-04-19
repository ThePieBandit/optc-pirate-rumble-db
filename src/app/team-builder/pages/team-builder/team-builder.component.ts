import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import UnitService from 'src/app/core/services/unit.service';
import * as rumble from '../../../shared/models/rumble';
import { UnitPickerComponent, UnitPickerData } from '../../components/unit-picker/unit-picker.component';
import { isTeamEffect, isDebuff, buffAppliesToTime, isHpBasedEffect, effectAppliesToUnitHp } from '../../../core/utils/effects';
import { battleTime } from '../../../core/constants/battle';
import { MatSliderChange } from '@angular/material/slider';
import { TeamUnit } from '../../models/team-unit';
import { Team } from '../../models/team';
import { UnitClickEvent, UnitHpChangeEvent } from '@team-builder/components/team/team.component';
import { LocalStorage } from 'ngx-store';

const mainTeamSize = 5;
const subTeamSize = 3;

@Component({
  selector: 'app-team-builder',
  templateUrl: './team-builder.component.html',
  styleUrls: ['./team-builder.component.css']
})
export class TeamBuilderComponent implements OnInit {

  @LocalStorage()
  blueTeamIds: number[] = Array.from(Array(mainTeamSize + subTeamSize));
  @LocalStorage()
  redTeamIds: number[] = Array.from(Array(mainTeamSize + subTeamSize));

  blueTeam: Team;
  redTeam: Team;
  battleTimer: number;

  initialBattleTime = battleTime;
  units: rumble.Unit[];

  constructor(
    private dialog: MatDialog,
    dataSource: UnitService,
  ) {
    this.units = dataSource.getUnits();
    this.battleTimer = battleTime;
    this.blueTeam = this.buildTeam('blue', this.blueTeamIds);
    this.redTeam = this.buildTeam('red', this.redTeamIds);
    this.updateBuffs();
    this.updateDebuffs();
    this.updateCost();
  }

  private buildTeam(color: string, ids: number[]): Team {
    const team: Team = {
      color,
      main: [],
      subs: [],
      effects: [],
      totals: {
        cost: 0,
      },
    };

    for (let index = 0; index <= mainTeamSize - 1; index++) {
      const unit = ids[index] != null ? this.createTeamUnit(this.units.find(u => u.id === ids[index])) : null;
      team.main.push(unit);
    }

    for (let index = mainTeamSize; index <= ids.length - 1; index++) {
      const unit = ids[index] != null ? this.createTeamUnit(this.units.find(u => u.id === ids[index])) : null;
      team.subs.push(unit);
    }

    return team;
  }

  private createTeamUnit(unit: rumble.Unit): TeamUnit {
    if (!unit) {
      return null;
    }
    return Object.assign(unit, {
      hp: 100,
      cooldown: 0,
      maxCooldown: unit.lvl10Cooldown,
    });
  }

  private buffApplies(effect: rumble.Effect, unit: TeamUnit, time?: number): boolean {
    return buffAppliesToTime(effect, time || this.battleTimer) &&
      effectAppliesToUnitHp(effect, unit.hp);
  }

  private updateAllTeams(): void {
    this.updateBuffs();
    this.updateDebuffs();
    this.updateCost();
  }

  ngOnInit(): void {
  }

  updateCost(): void {
    // update totals.cost based on main/sub team current state
  }

  private updateBuffs(time?: number): void {
    const teams = [this.redTeam, this.blueTeam];
    for (const team of teams) {
      team.effects = team.main
        .filter(unit => unit != null && unit.lvl5Ability != null)
        .flatMap(unit => unit.lvl5Ability.filter(e => isTeamEffect(e) && this.buffApplies(e, unit, time)))
      ;
    }
  }

  private updateDebuffs(time?: number): void {
    const redDebuffs = this.getDebuffs(this.redTeam, time);
    this.blueTeam.effects.push(...redDebuffs);

    const blueDebuffs = this.getDebuffs(this.blueTeam, time);
    this.redTeam.effects.push(...blueDebuffs);
  }

  private getDebuffs(team: Team, time?: number): rumble.Effect[] {
    return team.main
      .filter(unit => unit != null && unit.lvl5Ability != null)
      .flatMap(unit => unit.lvl5Ability.filter(e => isDebuff(e) && this.buffApplies(e, unit, time)));
  }

  unitClick(team: Team, event: UnitClickEvent): void {
    if (event.main) {
      this.mainTeamUnitClick(team, event.index);
    } else {
      this.subTeamUnitClick(team, event.index);
    }
  }

  private mainTeamUnitClick(team: Team, index: number): void {
    this.openUnitPicker(team, team.main[index], (data) => {
      team.main[index] = this.createTeamUnit(data);
      this.updateAllTeams();
    });
  }

  private subTeamUnitClick(team: Team, index: number): void {
    this.openUnitPicker(team, team.subs[index], (data) => {
      team.subs[index] = this.createTeamUnit(data);
      this.updateCost();
    });
  }

  private openUnitPicker(team: Team, current: rumble.Unit, onPick: (unit: rumble.Unit) => void): void {
    const dialogConfig = new MatDialogConfig<UnitPickerData>();

    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      team: [...team.main, ...team.subs].filter(u => u != null),
      current,
      units: this.units,
    };

    const dialogRef = this.dialog.open<UnitPickerComponent, UnitPickerData, rumble.Unit>(
      UnitPickerComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe(
      data => {
        if (data !== undefined) {
          // allow null so we can unset units
          onPick(data);
          // save both team ids since here we dont know which one was modified
          this.blueTeamIds = [...this.blueTeam.main, ...this.blueTeam.subs].map(u => u && u.id);
          this.redTeamIds = [...this.redTeam.main, ...this.redTeam.subs].map(u => u && u.id);
        }
      }
    );
  }

  battleTimerChange(event: MatSliderChange): void {
    this.battleTimer = event.value;
    this.updateBuffs(event.value);
    this.updateDebuffs(event.value);
  }

  unitHpChange(event: UnitHpChangeEvent): void {
    if (event.unit.lvl5Ability.some(e => isHpBasedEffect(e))) {
      this.updateBuffs(this.battleTimer);
      this.updateDebuffs(this.battleTimer);
    }
  }
}
