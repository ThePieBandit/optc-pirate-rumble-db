import { Injectable } from '@angular/core';

declare const window: any;

export class Unit {
    id: number;
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

    public getId(): number { return this.id; }
    public getName(): string { return this.name; }
    public getBaseHp(): number { return this.baseHp; }
    public getBaseAtk(): number { return this.baseAtk; }
    public getBaseRcv(): number { return this.baseRcv; }
    public getBaseDef(): number { return this.baseDef; }
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

@Injectable({
  providedIn: 'root'
})
export class DataService {

  units = [];

  constructor() {

    let unit: Unit;

    for (let i = 0; i < window.units.length; i++){
      if (!window.details[i + 1] || !window.details[i + 1].festAbility || window.units[i].incomplete || window.units[i][0].includes('[Dual Unit] ')){
          continue;
      }
      unit = new Unit();
      unit.id = i + 1;
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
     return this.units;
 }
}
