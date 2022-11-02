import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import UnitService from 'src/app/core/services/unit.service';
import { Effect } from '../../../shared/models/rumble';
import { UnitPickerComponent, UnitPickerData } from '../../components/unit-picker/unit-picker.component';
import { isTeamEffect, isDebuff, buffAppliesToTime, isHpBasedEffect, effectAppliesToUnitHp } from '../../../core/utils/effects';
import { battleTime } from '../../../core/constants/battle';
import { MatSliderChange } from '@angular/material/slider';
import { TeamUnit } from '../../models/team-unit';
import { Team } from '../../models/team';
import { UnitClickEvent, UnitHpChangeEvent } from '@team-builder/components/team/team.component';
import { LocalStorage } from 'ngx-store';
import { OptionEvent } from '@team-builder/components/team-builder-options/team-builder-options.component';
import { MatSidenav } from '@angular/material/sidenav';
import { UnitDetails } from '@shared/models/unit-details';

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
  @LocalStorage()
  hideSubs = false;
  @LocalStorage()
  showAllBuffs = false;
  @LocalStorage()
  oldestFirst = false;

  @ViewChild('optionsNav')
  optionsNav: MatSidenav;

  blueTeam: Team;
  redTeam: Team;
  battleTimer: number;

  initialBattleTime = battleTime;
  units: UnitDetails[];

  constructor(
    private dialog: MatDialog,
    dataSource: UnitService,
  ) {
    this.units = dataSource.getUnits();
    this.battleTimer = battleTime;
    this.blueTeam = this.buildTeam('blue', this.blueTeamIds);
    this.redTeam = this.buildTeam('red', this.redTeamIds);
    this.updateAllTeams();
  }

  private buildTeam(color: string, ids: number[]): Team {
    const team: Team = {
      type: 'normal',
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

  private createTeamUnit(unit: UnitDetails): TeamUnit {
    if (!unit) {
      return null;
    }
    return Object.assign({}, unit, {
      hp: 100,
      cooldown: 0,
      maxCooldown: unit.lvl10Cooldown,
      activeSpecial: false,
    });
  }

  private buffApplies(effect: Effect, unit: TeamUnit, time?: number): boolean {
    return buffAppliesToTime(effect, time || this.battleTimer) &&
      effectAppliesToUnitHp(effect, unit.hp);
  }

  private updateAllTeams(): void {
    this.updateBuffs();
    this.updateCost();
  }

  ngOnInit(): void {
  }

  updateCost(): void {
    // update totals.cost based on main/sub team current state
  }

  private updateBuffs(time?: number): void {
    // first set effects to a new array with all buffs
    const teams = [this.redTeam, this.blueTeam];
    for (const team of teams) {
      team.effects = team.main
        .filter(unit => unit != null && unit.lvl5Ability != null)
        .flatMap(unit => this.getUnitEffects(unit).filter(e => isTeamEffect(e) && this.buffApplies(e, unit, time)))
      ;
    }

    // now append debuffs to each team effects array
    const redDebuffs = this.getDebuffs(this.redTeam, time);
    this.blueTeam.effects.push(...redDebuffs);

    const blueDebuffs = this.getDebuffs(this.blueTeam, time);
    this.redTeam.effects.push(...blueDebuffs);
  }

  private getDebuffs(team: Team, time?: number): Effect[] {
    return team.main
      .filter(unit => unit != null && unit.lvl5Ability != null)
      .flatMap(unit => this.getUnitEffects(unit).filter(e => isDebuff(e) && this.buffApplies(e, unit, time)));
  }

  private getUnitEffects(unit: TeamUnit): Effect[] {
    if (unit.activeSpecial) {
      return [
        ...unit.lvl5Ability,
        ...unit.lvl10Special,
      ];
    }

    return unit.lvl5Ability;
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
      team.main = team.main.map((unit, i) => i === index ? this.createTeamUnit(data) : unit);
      this.updateAllTeams();
    });
  }

  private subTeamUnitClick(team: Team, index: number): void {
    this.openUnitPicker(team, team.subs[index], (data) => {
      team.subs = team.subs.map((unit, i) => i === index ? this.createTeamUnit(data) : unit);
      this.updateCost();
    });
  }

  private openUnitPicker(team: Team, current: UnitDetails, onPick: (unit: UnitDetails) => void): void {
    const dialogConfig = new MatDialogConfig<UnitPickerData>();

    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      team: [...team.main, ...team.subs].filter(u => u != null),
      current,
      units: this.units,
    };

    const dialogRef = this.dialog.open<UnitPickerComponent, UnitPickerData, UnitDetails>(
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
  }

  unitHpChange(event: UnitHpChangeEvent): void {
    if (this.isUnitWithHpBasedEffects(event.unit)) {
      this.updateBuffs(this.battleTimer);
    }
  }

  private isUnitWithHpBasedEffects(unit: TeamUnit): boolean {
    if (unit.lvl5Ability.some(e => isHpBasedEffect(e))) {
      return true;
    }
    if (unit.activeSpecial && unit.lvl10Special.some(e => isHpBasedEffect(e))) {
      return true;
    }
    return false;
  }

  optionClick(event: OptionEvent): void {
    switch (event.type) {
      case 'startOver':
        this.onStartOver();
        this.optionsNav.close();
        break;
      case 'hideSubs':
        this.hideSubs = !this.hideSubs;
        this.optionsNav.close();
        break;
      case 'showAllBuffs':
        this.showAllBuffs = !this.showAllBuffs;
        this.optionsNav.close();
        break;
      case 'specialsChange':
        const team = event.data.team as Team;
        const specials = new Set<number>(event.data.specials);
        team.main.filter(u => u != null).forEach(u => u.activeSpecial = specials.has(u.id));
        this.updateBuffs();
        break;
      case 'oldestFirst':
        this.oldestFirst = !this.oldestFirst;
        this.optionsNav.close();
        break;
    }
  }

  private onStartOver(): void {
    this.resetTeamUnits(this.blueTeam);
    this.resetTeamUnits(this.redTeam);
    this.redTeamIds = this.redTeamIds.map(x => null);
    this.blueTeamIds = this.blueTeamIds.map(x => null);
    this.battleTimer = battleTime;
    this.updateAllTeams();
  }

  private resetTeamUnits(team: Team): void {
    team.main = team.main.map(x => null);
    team.subs = team.subs.map(x => null);
  }

}
