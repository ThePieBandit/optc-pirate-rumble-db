import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SpecialEffect } from '@core/constants/effects';
import { EffectOutput } from '@shared/components/buff-picker/buff-picker.component';
import { Attribute } from '@shared/models/rumble';
import { UnitDetails } from '@shared/models/unit-details';
import { LocalStorage, Webstorable } from 'ngx-store';
import { UnitFilterArgs } from 'src/app/shared/pipes/unit-filter.pipe';
import { DetailsType } from '../unit-details-card/unit-details-card.component';

export interface UnitPickerData {
  team: UnitDetails[];
  current: UnitDetails;
  units: UnitDetails[];
  detailsType: DetailsType;
}

type UnitPickerFilter = UnitFilterArgs & {
  page: number;
  limit: number;
};

const initialFilter = (): UnitPickerFilter => ({
  page: 0,
  limit: 10,
  filter: '',
  classes: [],
  types: [],
  buffs: [],
  buffSearch: 'both',
  includeOtherClasses: true,
  hideBaseForms: true,
  specialEffects: [],
  abilityTargetType: 'any',
  specialTargetType: 'any',
  gpStatsTypes: [],
});

@Component({
  selector: 'app-unit-picker',
  templateUrl: './unit-picker.component.html',
  styleUrls: ['./unit-picker.component.css']
})
export class UnitPickerComponent implements OnInit {

  @ViewChild('paginator') paginator: MatPaginator;

  units: UnitDetails[];
  @LocalStorage() filter: UnitPickerFilter & Webstorable = {
    ...initialFilter(),
    save: undefined,
  };
  team: UnitDetails[];
  current: UnitDetails;

  @LocalStorage()
  oldestFirst = false;

  detailsType: DetailsType = 'normal';

  constructor(
    private dialogRef: MatDialogRef<UnitPickerComponent, UnitDetails>,
    @Inject(MAT_DIALOG_DATA) data: UnitPickerData
  ) {
    this.units = data.units.sort((a, b) => this.oldestFirst ? a.id - b.id : b.id - a.id);
    this.current = data.current;
    this.filter.filter = '';
    if (!this.filter.abilityTargetType) {
      this.filter.abilityTargetType = 'any';
    }
    if (!this.filter.specialTargetType) {
      this.filter.specialTargetType = 'any';
    }
    this.filter.page = 0;
    this.filter.excludeIds = data.team && data.team.map(u => u.id);
    if (data.detailsType) {
      this.detailsType = data.detailsType;
    }
  }

  ngOnInit(): void {
  }

  onUnset(): void {
    this.onPick(null);
  }

  reset(): void {
    this.filter = {
      ...this.filter, // keep calculated stuff such as excludeIds
      ...initialFilter(),
    };
  }

  onPick(unit?: UnitDetails): void {
    this.filter.save();
    this.dialogRef.close(unit);
  }

  pageChange(event: PageEvent): void {
    this.filter.page = event.pageIndex;
    this.filter.limit = event.pageSize;
  }

  classChange(event: string[]): void {
    this.paginator.firstPage();
    this.filter.classes = event;
  }

  typeChange(event: string[]): void {
    this.paginator.firstPage();
    this.filter.types = event;
  }

  effectChange(event: EffectOutput[]): void {
    this.paginator.firstPage();
    this.filter.buffs = event.filter(e => e.type === 'attribute').map(e => e.name as Attribute);
    this.filter.specialEffects = event.filter(e => e.type === 'specialEffect').map(e => e.name as SpecialEffect);
  }

  buffSearchChange(event: any): void {
    this.paginator.firstPage();
    this.filter.buffSearch = event.value;
  }

  abilityTargetTypeChange(event: any): void {
    this.paginator.firstPage();
    this.filter.abilityTargetType = event.value;
  }

  specialTargetTypeChange(event: any): void {
    this.paginator.firstPage();
    this.filter.specialTargetType = event.value;
  }

  gpStatsChange(event: any): void {
    this.paginator.firstPage();
    this.filter.gpStatsTypes = event.value;
  }

  resetPage(): void {
    this.paginator.firstPage();
  }
}
