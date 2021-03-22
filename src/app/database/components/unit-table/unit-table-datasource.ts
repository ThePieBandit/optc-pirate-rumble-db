import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, merge } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import * as rumble from '../../../shared/models/rumble';
import rumbleData from '../../../../assets/data/rumble.json';

declare const window: any;

export class UnitDetails {
  complete: boolean;
  id: number;
  isBaseForm: boolean;
  name: string;
  baseHp: number;
  baseAtk: number;
  baseRcv: number;
  baseDef: number;
  baseSpd: number;
  style: string;
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
  public getstyle(): string { return this.style; }
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
export class UnitTableDataSource extends MatTableDataSource<rumble.Unit> {
  database: rumble.Unit[] = [];

  filterChainSubject: BehaviorSubject<((unit: rumble.Unit) => boolean) []>
   = new BehaviorSubject<((unit: rumble.Unit) => boolean) []>([unit => !unit.isBaseForm]);

  constructor() {
    super();

    let unitDetail: UnitDetails;
    const unitDetails: UnitDetails[] = [];
    let unit: rumble.Unit;
    const units: rumble.Entry[] = rumbleData.units as rumble.Entry[];
    let vsUnit = false;

    for (let i = 0; i < window.units.length; i++){
      if (window.units[i].incomplete ){
          continue;
      }
      vsUnit = false;
      unitDetail = new UnitDetails();
      unitDetail.id = i + 1;
      unitDetail.complete = !window.units[i].incomplete;
      if (!unitDetail.complete) {
        unitDetails.push(unitDetail);
        continue;
      }
      unitDetail.isBaseForm = window.evolutions[i + 1];
      unitDetail.name = window.units[i][0];
      unitDetail.baseHp = window.units[i][12];
      unitDetail.baseAtk = window.units[i][13];
      unitDetail.baseRcv = window.units[i][14];
      // VS units will be handled later
      unitDetail.type = Array.isArray(window.units[i][1]) ? 'DUAL' : window.units[i][1];
      if (Array.isArray(window.units[i][2])) {
        if (Array.isArray(window.units[i][2][0])) {

          if (window.units[i][2].length === 2) { // VS unit
            unitDetail.class1 = window.units[i][2][0][0];
            unitDetail.class2 = window.units[i][2][0][1];
            vsUnit = true;
          } else { // dual unit, length == 3
            unitDetail.class1 = window.units[i][2][2][0];
            unitDetail.class2 = window.units[i][2][2][1];
          }
        } else { // Double class Unit
          unitDetail.class1 = window.units[i][2][0];
          unitDetail.class2 = window.units[i][2][1];
        }
      } else { // Single class unit
        unitDetail.class1 = window.units[i][2];
      }

      if (vsUnit) {
        unitDetail.id += 0.1;
        const unitDetailNameBase = unitDetail.name;
        unitDetail.name += ' (Character 1)';
        unitDetail.type = window.units[i][1][0];
        unitDetails.push(unitDetail);
        unitDetail = { ...unitDetail};
        unitDetail.id += 0.1;
        unitDetail.name = unitDetailNameBase + ' (Character 2)';
        unitDetail.type = window.units[i][1][1];
        unitDetail.class1 = window.units[i][2][1][0];
        unitDetail.class2 = window.units[i][2][1][1];
      }

      unitDetails.push(unitDetail);
    }

    for (let i = 0; i < units.length; i++){
      if ('basedOn' in units[i]) {
        const baseUnit: rumble.Unit = units.find(u => u.id === (units[i] as rumble.Reference).basedOn) as rumble.Unit;
        if (baseUnit === null || baseUnit === undefined) {
          console.log( ' Failed to locate Base Unit!!!!!!! ' + i);
          console.log(units[i]);
          continue;
        }
        try {
          unit = JSON.parse(JSON.stringify(baseUnit));
        } catch (error) {
          console.log('invalid JSON: ' + baseUnit);
          continue;
        }
        unit.id = units[i].id;
      } else {
        unit = (JSON.parse(JSON.stringify(units[i])) as rumble.Unit);
      }
      unitDetail = unitDetails.find(ud => ud.id === unit.id);
      if (unitDetail === null || unitDetail === undefined) {
        console.log( ' Failed to locate Base Unit Details!!!!!!!!!!! ' + i);
        console.log(unit);
        continue;
      }
      if (!unitDetail.complete){
        console.log( 'Skipping unit ' + unit.id + ', the unit is not complete.');
        continue;
      }
      if (unitDetail.name.includes('[Dual Unit] ')) {
        continue;
      }

      this.denormalizeEffects(unit.ability);
      this.denormalizeEffects(unit.special);

      unit.name = unitDetail.name;
      unit.isBaseForm = unitDetail.isBaseForm;
      unit.stats.hp = unitDetail.baseHp;
      unit.stats.atk = unitDetail.baseAtk;
      unit.stats.rcv = unitDetail.baseRcv;
      unit.stats.type = unitDetail.type;
      unit.stats.class1 = unitDetail.class1;
      unit.stats.class2 = unitDetail.class2;

      unit.lvl5Ability = (unit.ability[4].effects as rumble.Effect[]);
      unit.lvl10Special = (unit.special[9].effects as rumble.Effect[]);
      unit.lvl10Cooldown = unit.special[9].cooldown;
      unit.thumbnailUrl = window.Utils.getThumbnailUrl(Math.floor(unit.id)).replace('..', 'https://optc-db.github.io/');
      this.database.push(unit);
    }

    this.filterData();

  }

  denormalizeEffects(levels: rumble.Ability[]|rumble.Special[]): void {
    const lastEffect: rumble.Effect[] = [];
    let mergedEffect: rumble.Effect[] = [];

    levels.forEach( (level, levelIdx) => {
      mergedEffect = [...lastEffect];
      level.effects.forEach((effect: rumble.Effect | rumble.EffectOverride, effectIdx) => {
        if ('effect' in effect) {
          lastEffect[effectIdx] = (effect as rumble.Effect);
          mergedEffect[effectIdx] = (effect as rumble.Effect);
        } else if ('override' in effect){
          mergedEffect[effectIdx] = {...lastEffect[effectIdx], ...(effect as rumble.EffectOverride).override};
        }
      });
      level.effects = mergedEffect;
    });
  }

  filterData(): void {
    let tmpData: rumble.Unit[] = this.database;
    this.filterChainSubject.value.forEach(unitFilter => tmpData = tmpData.filter(unitFilter));
    this.data = tmpData;
    this._updateChangeSubscription();
  }
}
