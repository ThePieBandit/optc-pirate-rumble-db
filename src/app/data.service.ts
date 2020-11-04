import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class DataService {

  units = [];
  statBaseSubject: BehaviorSubject<string> = new BehaviorSubject<string>('LEVEL');
  statTypeSubject: BehaviorSubject<string> = new BehaviorSubject<string>('RAW');
  filterChainSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {

    let unit: Unit;

    for (let i = 0; i < window.units.length; i++){
      if (!window.details[i + 1] || !window.details[i + 1].festAbility || window.units[i].incomplete || window.units[i][0].includes('[Dual Unit] ')){
          continue;
      }
      if(window.details[i+1].VSSpecial)
        continue; // temporary
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
      unit.type = Array.isArray(window.units[i][1]) ? 'NONE' : window.units[i][1];
      unit.festAbility = window.details[i + 1].festAbility;
      unit.festSpecial = window.details[i + 1].festSpecial;
      unit.festAttackPattern = window.details[i + 1].festAttackPattern;
      unit.festAttackTarget = window.details[i + 1].festAttackTarget;
      this.units.push(unit);
   }
 }

  public getPFDetails(): Array<Unit>{
     return this.filterChainSubject.value ? this.units.filter(unit => !unit.isBaseForm) : this.units;
 }
}

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
    festAbility: any;
    festSpecial: any;
    festAttackPattern: string;
    festAttackTarget: string;

    private computeDefPercentage(): number {
      return 9.6671298720642E-17*this.baseDef**6
              -2.54940335570173E-13*this.baseDef**5
              +0.000000000265685114974299*this.baseDef**4
              -0.000000135059490498531*this.baseDef**3
              +0.000030881486606793*this.baseDef**2
              -0.000309272395298876*this.baseDef
              +0.00126339332598491 * 100;
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
}
