import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import UnitService from '../../core/services/unit.service';
import { Injectable } from '@angular/core';
import { UnitDetails } from '@shared/models/unit-details';

/**
 * Data source for the UnitTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
@Injectable()
export class UnitTableDataSource extends MatTableDataSource<UnitDetails> {
  database: UnitDetails[] = [];

  filterChainSubject: BehaviorSubject<((unit: UnitDetails) => boolean) []>
   = new BehaviorSubject<((unit: UnitDetails) => boolean) []>([unit => !unit.isBaseForm]);

  constructor(unitService: UnitService) {
    super();
    for (const unit of unitService.getUnits()) {
      this.database.push(unit);
    }
    this.filterData();
  }

  filterData(): void {
    let tmpData: UnitDetails[] = this.database;
    this.filterChainSubject.value.forEach(unitFilter => tmpData = tmpData.filter(unitFilter));
    this.data = tmpData;
    this._updateChangeSubscription();
  }
}
