import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TeamOptions } from '@team-builder/models/team-options';
import { TeamUnit } from '@team-builder/models/team-unit';
import { Team } from '../../models/team';

export interface UnitClickEvent {
  index: number;
  main: boolean;
}

export interface UnitHpChangeEvent {
  unit: TeamUnit;
  newHp: number;
}

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  @Input()
  options: TeamOptions;

  @Input()
  team: Team;

  @Input()
  battleTimer: number;

  @Input()
  compact: boolean;

  @Output()
  unitClick: EventEmitter<UnitClickEvent> = new EventEmitter<UnitClickEvent>();

  @Output()
  unitHpChange: EventEmitter<UnitHpChangeEvent> = new EventEmitter<UnitHpChangeEvent>();

  constructor() { }

  ngOnInit(): void {
  }

  mainTeamUnitClick(index: number): void {
    this.unitClick.emit({
      index,
      main: true
    });
  }

  subTeamUnitClick(index: number): void {
    this.unitClick.emit({
      index,
      main: false
    });
  }

  hpChange(unit: TeamUnit, newHp: number): void {
    if (unit.hp !== newHp) {
      console.warn('they are different!!!!!!!!!!!!!!!!');
      return;
    }
    this.unitHpChange.emit({
      unit,
      newHp,
    });
  }

}
