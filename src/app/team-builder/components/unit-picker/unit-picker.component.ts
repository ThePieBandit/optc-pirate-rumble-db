import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { LocalStorage, Webstorable } from 'ngx-store';
import { UnitFilterArgs } from 'src/app/shared/pipes/unit-filter.pipe';
import * as rumble from '../../../shared/models/rumble';

export interface UnitPickerData {
  team: rumble.Unit[];
  current: rumble.Unit;
  units: rumble.Unit[];
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
});

@Component({
  selector: 'app-unit-picker',
  templateUrl: './unit-picker.component.html',
  styleUrls: ['./unit-picker.component.css']
})
export class UnitPickerComponent implements OnInit {

  @ViewChild('paginator') paginator: MatPaginator;

  units: rumble.Unit[];
  @LocalStorage() filter: UnitPickerFilter & Webstorable = {
    ...initialFilter(),
    save: undefined,
  };
  team: rumble.Unit[];
  current: rumble.Unit;

  constructor(
    private dialogRef: MatDialogRef<UnitPickerComponent, rumble.Unit>,
    @Inject(MAT_DIALOG_DATA) data: UnitPickerData
  ) {
    this.units = data.units;
    this.current = data.current;
    this.filter.page = 0;
    this.filter.excludeIds = data.team && data.team.map(u => u.id);
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

  onPick(unit?: rumble.Unit): void {
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

  buffChange(event: string[]): void {
    this.paginator.firstPage();
    this.filter.buffs = event;
  }

  buffSearchChange(event: any): void {
    this.paginator.firstPage();
    this.filter.buffSearch = event.value;
  }

  resetPage(): void {
    this.paginator.firstPage();
  }
}
