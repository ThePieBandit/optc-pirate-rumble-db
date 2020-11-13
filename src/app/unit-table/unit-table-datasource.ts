import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, merge } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

declare const window: any;

export class Unit {
  id: number;
  isBaseForm: boolean;
  name: string;
  baseHp: number;
  baseAtk: number;
  baseRcv: number;
  baseDef: number;
  baseSpd: number;
  rumbleType: string;
  type: string;
  class1: string;
  class2: string;
  festAbility: string;
  festSpecial: string;
  festCooldown: string;
  festAttackPattern: string;
  festAttackTarget: string;

/*
  private computeDefPercentage(): number {
    return 9.6671298720642E-17 * this.baseDef ** 6
            - 2.54940335570173E-13 * this.baseDef ** 5
            + 0.000000000265685114974299 * this.baseDef ** 4
            - 0.000000135059490498531 * this.baseDef ** 3
            + 0.000030881486606793 * this.baseDef ** 2
            - 0.000309272395298876 * this.baseDef
            + 0.00126339332598491 * 100;
  }

  public getId(): number { return this.id; }
  public getName(): string { return this.name; }
  public getBaseHp(): number { return this.baseHp; }
  public getBaseAtk(): number { return this.baseAtk; }
  public getBaseRcv(): number { return this.baseRcv; }
  public getBaseDef(): number { return Math.round((this.computeDefPercentage() + Number.EPSILON) * 100) / 100; }
  public getBaseSpd(): number { return this.baseSpd; }
  public getRumbleType(): string { return this.rumbleType; }
  public getType(): string { return '<span class="badge text-monospace badge-pill ' + this.type + '">' + this.type + '</span>'; }
  public getFestAbility(): string { return this.encodeText(this.festAbility[4].description); }
  public getFestSpecial(): string { return this.encodeText(this.festSpecial[9].description); }
  public getFestAttackPattern(): string { return this.festAttackPattern; }
  public getFestAttackTarget(): string { return this.festAttackTarget; }

  private encodeText(s: string): string
  {
    return s.replace(/\[([A-Z]+)\]/gi,
                     '<span class="badge text-monospace badge-pill $1">$1</span>');
  }
  */
}

/**
 * Data source for the UnitTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
@Injectable({
   providedIn: 'root'
 })
export class UnitTableDataSource extends MatTableDataSource<Unit> {
  database: Unit[] = [];
  filterChainSubject: BehaviorSubject<((unit: Unit) => boolean) []> = new BehaviorSubject<((unit: Unit) => boolean) []>([unit => !unit.isBaseForm]);

constructor() {
    super();

    let unit: Unit;

    for (let i = 0; i < window.units.length; i++){
      if (!window.details[i + 1] || !window.details[i + 1].festAbility || window.units[i].incomplete || window.units[i][0].includes('[Dual Unit] ')){
          continue;
      }
      if (window.details[i + 1].VSSpecial) {
        continue;
      } // temporary
      unit = new Unit();
      unit.id = i + 1;
      unit.isBaseForm = window.evolutions[i + 1];
      unit.name = window.units[i][0];
      unit.baseHp = window.units[i][12];
      unit.baseAtk = window.units[i][13];
      unit.baseRcv = window.units[i][14];
      unit.baseDef = window.festival[i][1];
      unit.baseSpd = window.festival[i][2];
      unit.rumbleType = window.festival[i][0];
      unit.type = Array.isArray(window.units[i][1]) ? 'DUAL' : window.units[i][1];
      if (Array.isArray(window.units[i][2])) {
        if (Array.isArray(window.units[i][2][0])) { //dual unit
          unit.class1 = window.units[i][2][2][0];
          unit.class2 = window.units[i][2][2][1];
        } else { // Double class Unit
          unit.class1 = window.units[i][2][0];
          unit.class2 = window.units[i][2][1];
        }
      } else { // Single class unit
        unit.class1 = window.units[i][2];
      }
      unit.festAbility = window.details[i + 1].festAbility;
      unit.festSpecial = window.details[i + 1].festSpecial;
      unit.festAttackPattern = window.details[i + 1].festAttackPattern;
      unit.festAttackTarget = window.details[i + 1].festAttackTarget;
      this.database.push(unit);
    }
    this.filterData();
  }

  filterData(): void {
    let tmpData: Unit[] = this.database;
    this.filterChainSubject.value.forEach(unitFilter => tmpData = tmpData.filter(unitFilter));
    this.data = tmpData;
    this._updateChangeSubscription();
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
   /*
  private getSortedData(data: Unit[]): Unit[] {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        case 'baseHp': return compare(+a.baseHp, +b.baseHp, isAsc);
        case 'baseAtk': return compare(+a.baseAtk, +b.baseAtk, isAsc);
        case 'baseRcv': return compare(+a.baseRcv, +b.baseRcv, isAsc);
        case 'baseDef': return compare(+a.baseDef, +b.baseDef, isAsc);
        case 'baseSpd': return compare(+a.baseSpd, +b.baseSpd, isAsc);
        default: return 0;
      }
    });
  }*/
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
