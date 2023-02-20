import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
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

// for now sort types must be root properties of the unit object
type SortType = 'id' | 'name' | 'type' | 'lvl10Cooldown';
type SortOption = {
  label: string;
  type: SortType;
}

const sortOption = (type: SortType, label: string): SortOption => ({
  label,
  type,
});

@Component({
  selector: 'app-unit-picker',
  templateUrl: './unit-picker.component.html',
  styleUrls: ['./unit-picker.component.css']
})
export class UnitPickerComponent implements OnInit {

  @ViewChild('paginator') 
  paginator: MatPaginator;

  units: UnitDetails[];

  @LocalStorage()
  filter: UnitPickerFilter & Webstorable = {
    ...initialFilter(),
    save: undefined,
  };
  team: UnitDetails[];
  current: UnitDetails;

  @LocalStorage()
  sortColumn: SortType = 'id';

  @LocalStorage()
  sortAscending = false;

  detailsType: DetailsType = 'normal';

  sortOptions = [
    sortOption('id', 'Released'),
    sortOption('name', 'Name'),
    sortOption('type', 'Type'),
    sortOption('lvl10Cooldown', 'Special CT'),
  ];

  constructor(
    private dialogRef: MatDialogRef<UnitPickerComponent, UnitDetails>,
    @Inject(MAT_DIALOG_DATA) data: UnitPickerData,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.units = data.units;
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

  sortUnits() {
    this.units.sort(this.unitSorter);
    this.changeDetectorRef.detectChanges();
  }

  private unitSorter = (a: {}, b: {}): number => {
    const aValue = a[this.sortColumn];
    const bValue = b[this.sortColumn];
    const asc = this.sortAscending;
    if (aValue == null) {
      return bValue == null ? 0 : (asc ? 1 : -1);
    }
    else if (bValue == null) {
      return aValue == null ? 0 : (asc ? 1 : -1);
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return asc ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      return asc ? aValue - bValue : bValue - aValue;
    } else {
      // If the types are not the same, compare them as strings
      return asc ? aValue.toString().localeCompare(bValue.toString()) : bValue.toString().localeCompare(aValue.toString());
    }  
  };

  ngOnInit(): void {
    this.sortUnits();
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
