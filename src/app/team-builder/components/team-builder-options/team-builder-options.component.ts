import { Component, EventEmitter, OnInit, Output } from '@angular/core';

export type OptionType = 'startOver' | 'TODO1' | 'TODO2';
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
  styleUrls: ['./team-builder-options.component.css']
})
export class TeamBuilderOptionsComponent implements OnInit {

  @Output()
  optionClick = new EventEmitter<OptionEvent>();

  teamOptions: OptionEntry[];

  constructor() {
    this.teamOptions = [
      buildOption('startOver', 'Start over'),
    ];
  }

  ngOnInit(): void {
  }

  triggerOption(type: OptionType): void {
    this.optionClick.emit({ type, data: null });
  }

}
