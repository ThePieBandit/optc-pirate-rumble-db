import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Team } from '@team-builder/models/team';
import { Pipe, PipeTransform } from '@angular/core';
import { TeamUnit } from '@team-builder/models/team-unit';

@Pipe ({
   name : 'validUnit'
})
export class ValidUnitPipe implements PipeTransform {
   transform(units: TeamUnit[]): TeamUnit[] {
      return units.filter(u => u != null && u.lvl10Special);
   }
}

export type OptionType = 'startOver' | 'specialsChange' | 'hideSubs' | 'showAllBuffs' | 'oldestFirst';
export interface OptionEvent {
  type: OptionType;
  data: any;
}

interface OptionEntry {
  text: string;
  type: OptionType;
}

const buildOption = (type: OptionType, text: string): OptionEntry => ({
  text,
  type,
});

@Component({
  selector: 'app-team-builder-options',
  templateUrl: './team-builder-options.component.html',
  styleUrls: ['./team-builder-options.component.css'],
})
export class TeamBuilderOptionsComponent implements OnInit {

  @Input()
  teams: Team[];

  @Output()
  optionClick = new EventEmitter<OptionEvent>();

  teamOptions: OptionEntry[];
  pickerOptions: OptionEntry[];

  constructor() {
    this.teamOptions = [
      buildOption('startOver', 'Start over'),
      buildOption('hideSubs', 'Show/Hide subs'),
      buildOption('showAllBuffs', 'Show/Hide all buffs')
    ];
    this.pickerOptions = [
      buildOption('oldestFirst', 'Show old/new units first'),
    ];
  }

  ngOnInit(): void {
  }

  triggerOption(type: OptionType): void {
    this.optionClick.emit({ type, data: null });
  }

  specialChange(activatedUnitIds: number[], team: Team): void {
    this.optionClick.emit({
      type: 'specialsChange',
      data: {
        specials: activatedUnitIds,
        team,
      },
    });
  }
}
