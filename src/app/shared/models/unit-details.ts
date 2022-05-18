import { Unit, Effect, Classes } from './rumble';

export interface UnitDetails extends Unit {
  complete: boolean;
  isBaseForm: boolean;
  name: string;
  baseHp: number;
  baseAtk: number;
  baseRcv: number;
  baseDef?: number;
  baseSpd?: number;
  style?: string;
  type: string;
  class1?: Classes;
  class2?: Classes;
  festAbility?: string;
  festSpecial?: string;
  festCooldown?: string;
  festAttackPattern?: string;
  festAttackTarget?: string;
  lvl5Ability?: Effect[];
  lvl10Special?: Effect[];
  lvl10Cooldown?: number;
  thumbnailUrl?: string;
  aliases: string[];

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
