import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Team } from '@team-builder/models/team';
import { Pipe, PipeTransform } from '@angular/core';
import { TeamUnit } from '@team-builder/models/team-unit';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BuffBuilderComponent } from '../buff-builder/buff-builder.component';
import { Effect } from '@shared/models/rumble';
import { LocalStorageService } from 'ngx-store';

@Pipe ({
   name : 'validUnit'
})
export class ValidUnitPipe implements PipeTransform {
   transform(units: TeamUnit[]): TeamUnit[] {
      return units.filter(u => u != null && u.lvl10Special);
   }
}

export type OptionType = 'startOver' | 'specialsChange' | 'hideSubs' | 'showAllBuffs' | 'seasonBuffsChange';
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

  @Input()
  seasonIdentifier: string = 'normal';

  @Output()
  optionClick = new EventEmitter<OptionEvent>();

  teamOptions: OptionEntry[];
  buffs: Effect[];

  constructor(
    private dialog: MatDialog,
    private localStore: LocalStorageService
  ) {
    this.teamOptions = [
      buildOption('startOver', 'Start over'),
      buildOption('hideSubs', 'Show/Hide subs'),
      buildOption('showAllBuffs', 'Show/Hide all buffs')
    ];
    this.buffs = [];
  }

  getSeasonBuffsCacheKey = () => `season-buffs-${this.seasonIdentifier}`;

  ngOnInit(): void {
    const cachedBuffs = this.localStore.get(this.getSeasonBuffsCacheKey());
    if (cachedBuffs != null && Array.isArray(cachedBuffs)) {
      this.buffs = cachedBuffs;
      this.sendBuffsChange(cachedBuffs);
    }
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

  addSeasonBuff(): void {
    const dialogConfig = new MatDialogConfig<{}>();
    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open<BuffBuilderComponent, {}, Effect>(
      BuffBuilderComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe(
      data => {
        if (data == null) {
          return;
        }

        this.buffs.push(data);
        this.onBuffsChange();
      }
    );
  }

  onDeleteBuff(index: number): void {
    this.buffs.splice(index, 1);
    this.onBuffsChange();
  }

  private onBuffsChange() {
    this.localStore.set(this.getSeasonBuffsCacheKey(), this.buffs);
    this.sendBuffsChange(this.buffs);
  }

  private sendBuffsChange(buffs: Effect[]) {
    this.optionClick.emit({
      type: 'seasonBuffsChange',
      data: buffs,
    });
  }
}
