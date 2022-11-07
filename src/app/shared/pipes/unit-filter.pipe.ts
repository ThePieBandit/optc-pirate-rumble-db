import { Pipe, PipeTransform } from '@angular/core';
import { GPStyle, UnitDetails } from '@shared/models/unit-details';
import { Attribute, Classes, Effect } from '@shared/models/rumble';
import { types, classes } from '@core/constants/units';
import { SpecialEffect } from '@core/constants/effects';

export type BuffSearchType = 'both' | 'ability' | 'special';
export type EffectTargetType = 'any' | 'crew' | 'type' | 'class';

export interface UnitFilterArgs {
  filter: string;
  classes: string[];
  includeOtherClasses: boolean;
  specialEffects: SpecialEffect[];
  healingSpecial?: boolean;
  types: string[];
  buffs: Attribute[];
  buffSearch: BuffSearchType;
  abilityTargetType: EffectTargetType;
  specialTargetType: EffectTargetType;
  excludeIds?: number[];
  hideBaseForms?: boolean;
  gpStatsTypes: GPStyle[];
}

@Pipe({
  name: 'unitFilter',
  pure: false,
})
export class UnitFilterPipe implements PipeTransform {

  transform(value: UnitDetails[], ...args: UnitFilterArgs[]): UnitDetails[] {
    const arg = args && args[0];
    if (!arg) {
      return value.slice(0, 10);
    }

    let filtered = value;
    const nameFilter = arg.filter && arg.filter.toLowerCase();
    if (arg.hideBaseForms) {
      filtered = filtered.filter(u => !u.isBaseForm);
    }
    if (nameFilter) {
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(nameFilter) ||
        u.aliases && u.aliases.some(a => a.toLowerCase().includes(nameFilter))
      );
    }
    if (arg.gpStatsTypes && arg.gpStatsTypes.length > 0) {
      filtered = filtered.filter(u => arg.gpStatsTypes.includes(u.gpStyle));
    }
    if (arg.types && arg.types.length) {
      filtered = filtered.filter(u => u.stats && arg.types.some(t => t === `[${u.stats.type}]`));
    }
    if (arg.classes && arg.classes.length) {
      const set = new Set(arg.classes);
      if (arg.includeOtherClasses) {
        filtered = filtered.filter(u => u.stats && set.has(u.stats.class1) || set.has(u.stats.class2));
      } else {
        filtered = filtered.filter(u =>
          u.stats &&
          set.has(u.stats.class1) &&
          ((set.size === 1 && !u.stats.class2) || set.has(u.stats.class2)));
      }
    }
    if (arg.buffs && arg.buffs.length) {
      switch (arg.buffSearch) {
        case 'ability':
          filtered = filtered.filter(u => this.effectMatches(u.lvl5Ability, arg.buffs));
          break;
        case 'special':
          filtered = filtered.filter(u => this.effectMatches(u.lvl10Special, arg.buffs));
          break;
        default:
          filtered = filtered.filter(u => this.effectMatches(u.lvl5Ability, arg.buffs) || this.effectMatches(u.lvl10Special, arg.buffs));
          break;
      }
    }

    filtered = this.filterByEffectTargetType(filtered, arg.abilityTargetType, u => u.lvl5Ability);

    filtered = this.filterByEffectTargetType(filtered, arg.specialTargetType, u => u.lvl10Special);

    if (arg.excludeIds && arg.excludeIds.length) {
      const set = new Set(arg.excludeIds);
      filtered = filtered.filter(u => !set.has(u.id));
    }

    if (arg.specialEffects) {
      arg.specialEffects.forEach(effect => {
        switch (effect) {
          case 'defIgnoring':
            filtered = this.filterBySpecialEffect(filtered, e => e.defbypass);
            break;
          case 'multipleHits':
            filtered = this.filterBySpecialEffect(filtered, e => e.repeat > 1);
            break;
          case 'recharge':
            filtered = this.filterBySpecialEffect(filtered, e => e.effect === effect && ['RCV', 'fixed', 'percentage'].includes(e.type));
            break;
          default:
            console.warn('unexpected special effect ' + effect);
            break;
        }
      });
    }

    // we cant do pagination at this level because we need
    // the full filtered array to know the number of items/pages
    return filtered;
  }

  private filterByEffectTargetType(current: UnitDetails[], type: EffectTargetType, effectFn: (unit: UnitDetails) => Effect[]) {
    if (!type) {
      return current;
    }
    switch (type) {
      case 'crew':
        return current.filter(u => this.targetsCrew(effectFn(u)));
      case 'type':
        return current.filter(u => this.targetsTypes(effectFn(u)));
      case 'class':
        return current.filter(u => this.targetsClasses(effectFn(u)));
      case 'any':
        // no need to filter anything
        return current;
      default:
        console.warn('unexpected EffectTargetType: ' + type);
        return current;
    }
  }
  
  private targetsClasses(lvl5Ability: Effect[]): boolean {
    return this.getTargetingEffects(lvl5Ability).some(e => e.targeting.targets.some(t => classes.includes(t as Classes)));
  }
  
  private targetsTypes(lvl5Ability: Effect[]): boolean {
    return this.getTargetingEffects(lvl5Ability).some(e => e.targeting.targets.some(t => types.includes(t)));
  }
  
  private targetsCrew(lvl5Ability: Effect[]): boolean {
    return this.getTargetingEffects(lvl5Ability).some(e => e.targeting.targets.includes('crew'));
  }

  private effectMatches(effects: Effect[], buffs: string[]): boolean {
    return buffs.every(buff => effects.some(effect =>
      (effect.effect === 'buff' || effect.effect === 'hinderance') &&
      effect.attributes.some(attr => attr === buff)
    ));
  }

  private getTargetingEffects = (effects: Effect[]) => effects.filter(e => e.effect === 'buff' && e.targeting && e.targeting.targets);

  private filterBySpecialEffect = (current: UnitDetails[], predicate: (effect: Effect) => boolean) => current.filter(u => u.lvl10Special.some(predicate));
}
