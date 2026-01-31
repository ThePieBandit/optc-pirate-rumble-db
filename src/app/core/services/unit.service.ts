import * as rumble from '../../shared/models/rumble';
import rumbleData from '../../../assets/data/rumble.json';
import { UnitDetails } from '../../shared/models/unit-details';
import { Injectable } from '@angular/core';

declare const window: any;

type TempUnit = Omit<UnitDetails, 'stats' | 'ability' | 'target' | 'pattern' | 'special' | 'gpability' | 'gpspecial' | 'gpcondition'>;

// dont declare service as singleton (i.e., providedIn: 'root')
// so that each client of the service can get an instance based on its needs
// (eg, instance per module or instance per component)
@Injectable()
class UserService {

  private rumbleUnits: UnitDetails[] = [];

  constructor() {
    const unitDetails: TempUnit[] = [];
    for (var id of Object.keys(window.units)) {
      if (window.units[id].incomplete) {
          continue;
      }

      let vsUnit = false;
      let idNum = Number(id);
      const rarity = window.units[id]['stars'];
      const unitDetail: TempUnit = {
        id: idNum,
        complete: true,
        isBaseForm: window.evolutions[id] && rarity !== 6,
        name: window.units[id]['name'],
        baseHp: window.units[id]['maxHP'],
        baseAtk: window.units[id]['maxATK'],
        baseRcv: window.units[id]['maxRCV'],
        type: Array.isArray(window.units[id]['name']) ? 'DUAL' : window.units[id]['name'],
        aliases: this.getUnitAliases(idNum),
        gpStyle: 'none',
      };

      // VS units will be handled later
      if (Array.isArray(window.units[id]['class'])) {
        if (Array.isArray(window.units[id]['class'][0])) {
          if (window.units[id]['class'].length === 2) { // VS unit
            unitDetail.class1 = window.units[id]['class'][0][0];
            unitDetail.class2 = window.units[id]['class'][0][1];
            vsUnit = true;
          } else { // dual unit, length == 3
            unitDetail.class1 = window.units[id]['class'][2][0];
            unitDetail.class2 = window.units[id]['class'][2][1];
          }
        } else { // Double class Unit
          unitDetail.class1 = window.units[id]['class'][0];
          unitDetail.class2 = window.units[id]['class'][1];
        }
      } else { // Single class unit
        unitDetail.class1 = window.units[id]['class'];
      }

      if (vsUnit) {
        unitDetail.id += 0.1;
        const unitDetailNameBase = unitDetail.name;
        unitDetail.name += ' (Character 1)';
        unitDetail.type = window.units[id]['type'][0];
        unitDetails.push(unitDetail);
        const secondUnit = Object.assign({}, unitDetail);
        secondUnit.id += 0.1;
        secondUnit.name = unitDetailNameBase + ' (Character 2)';
        secondUnit.type = window.units[id]['type'][1];
        secondUnit.class1 = window.units[id]['class'][1][0];
        secondUnit.class2 = window.units[id]['class'][1][1];
        unitDetails.push(secondUnit);
      } else {
        unitDetails.push(unitDetail);
      }
    }

    const units: rumble.Entry[] = rumbleData.units as rumble.Entry[];
    for (let i = 0; i < units.length; i++) {
      let unit: rumble.Unit;
      let basedOn = units[i].basedOn;
      if (basedOn) {
        let baseUnit: rumble.Unit;
        do {
          baseUnit = units.find(u => u.id === basedOn) as rumble.Unit;
          basedOn = baseUnit && baseUnit.basedOn;
        } while (basedOn);

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
      // skip "ghost" units so they dont show duplicated
      if (unitDetail.name.startsWith('[Dual Unit] ') || unitDetail.name.startsWith('[VS Unit] ')) {
        continue;
      }

      if (!unit.ability || !unit.special || !unit.stats) {
        console.log('unexpected unit ' + unit.id, unit);
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
      if (unit.gpability) {
        this.denormalizeEffects(unit.gpability);
        unitDetail.lvl5GPAbility = (unit.gpability[4].effects as rumble.Effect[]);
      }
      if (unit.gpspecial) {
        this.denormalizeEffects(unit.gpspecial);
        unitDetail.lvl5GPSpecial = (unit.gpspecial[4].effects as rumble.Effect[]);
        // small hack to identify units with "standard" GP Bursts and Leader Skills
        // since they dont come in rumble.json data
        const firstEffect = unitDetail.lvl5GPSpecial[0];
        const isStandard = unitDetail.lvl5GPSpecial.length === 1
          && firstEffect.amount === 1000
          && firstEffect.effect === 'damage'
          && firstEffect.type === 'fixed';
        unitDetail.gpStyle = isStandard ? 'standard' : 'unique';
      }
      unitDetail.lvl10Cooldown = unit.special[9].cooldown;
      //unitDetail.thumbnailUrl = window.Utils.getThumbnailUrl(Math.floor(unit.id)).replace('..', 'https://2shankz.github.io/optc-db.github.io/');
      unitDetail.thumbnailUrl = 'https://2shankz.github.io/optc-db.github.io/' + window.Utils.getThumbnailUrl(Math.floor(unit.id).toString()).glo;

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
