import * as rumble from '../../shared/models/rumble';
import rumbleData from '../../../assets/data/rumble.json';
import { UnitDetails } from '../../shared/models/unit-details';
import { Injectable } from '@angular/core';

declare const window: any;

type TempUnit = Omit<UnitDetails, 'stats' | 'ability' | 'target' | 'pattern' | 'special'>;

// dont declare service as singleton (i.e., providedIn: 'root')
// so that each client of the service can get an instance based on its needs
// (eg, instance per module or instance per component)
@Injectable()
class UserService {

  private rumbleUnits: UnitDetails[] = [];

  constructor() {
    const unitDetails: TempUnit[] = [];
    for (let i = 0; i < window.units.length; i++){
      if (window.units[i].incomplete) {
          continue;
      }

      let vsUnit = false;
      const id = i + 1;
      const unitDetail: TempUnit = {
        id,
        complete: true,
        isBaseForm: window.evolutions[id],
        name: window.units[i][0],
        baseHp: window.units[i][12],
        baseAtk: window.units[i][13],
        baseRcv: window.units[i][14],
        type: Array.isArray(window.units[i][1]) ? 'DUAL' : window.units[i][1],
        aliases: this.getUnitAliases(id),
      };

      // VS units will be handled later
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
        const secondUnit = Object.assign({}, unitDetail);
        secondUnit.id += 0.1;
        secondUnit.name = unitDetailNameBase + ' (Character 2)';
        secondUnit.type = window.units[i][1][1];
        secondUnit.class1 = window.units[i][2][1][0];
        secondUnit.class2 = window.units[i][2][1][1];
        unitDetails.push(secondUnit);
      } else {
        unitDetails.push(unitDetail);
      }
    }

    const units: rumble.Entry[] = rumbleData.units as rumble.Entry[];
    for (let i = 0; i < units.length; i++) {
      let unit: rumble.Unit;
      if ('basedOn' in units[i]) {
        const baseUnit: rumble.Unit = units.find(u => u.id === (units[i] as rumble.Reference).basedOn) as rumble.Unit;
        if (baseUnit == null) {
          console.log( ' Failed to locate Base Unit!!!!!!! ' + i, units[i]);
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
      const unitDetail = unitDetails.find(ud => ud.id === unit.id);
      if (unitDetail == null) {
        console.log( ' Failed to locate Base Unit Details!!!!!!!!!!! ' + i, unit);
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

      unit.stats.hp = unitDetail.baseHp;
      unit.stats.atk = unitDetail.baseAtk;
      unit.stats.rcv = unitDetail.baseRcv;
      unit.stats.type = unitDetail.type;
      unit.stats.class1 = unitDetail.class1;
      unit.stats.class2 = unitDetail.class2;

      unitDetail.baseDef = unit.stats.def;
      unitDetail.baseSpd = unit.stats.spd;
      unitDetail.lvl5Ability = (unit.ability[4].effects as rumble.Effect[]);
      unitDetail.lvl10Special = (unit.special[9].effects as rumble.Effect[]);
      unitDetail.lvl10Cooldown = unit.special[9].cooldown;
      unitDetail.thumbnailUrl = window.Utils.getThumbnailUrl(Math.floor(unit.id)).replace('..', 'https://optc-db.github.io/');

      // merge of all props between unit and unitDetail
      this.rumbleUnits.push({
        ...unit,
        ...unitDetail
      });
    }
  }

  private denormalizeEffects(levels: rumble.Ability[] | rumble.Special[]): void {
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

  private getUnitAliases(id: number): string[] {
    const result = [];
    const unitAliases = window.aliases && window.aliases[id];
    if (unitAliases) {
      result.push(...unitAliases);
    }

    const unitFamilies = window.families && window.families[id];
    if (unitFamilies) {
      result.push(...unitFamilies);
    }

    return result;
  }

  // we can make a shallow copy of the array if we are worried
  // about clients directly modifying the array,
  // but thats something they shouldnt do in the first place
  public getUnits = () => this.rumbleUnits;
}

export default UserService;
