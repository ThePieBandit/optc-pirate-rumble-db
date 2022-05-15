import { Pipe, PipeTransform } from '@angular/core';
import { UnitDetails } from '@shared/models/unit-details';
import { Effect, Classes, Colors } from '../../shared/models/rumble';

export type BuffSearchType = 'both' | 'ability' | 'special';
export type AbilityTargetType = 'any' | 'crew' | 'type' | 'class';

export interface UnitFilterArgs {
  filter: string;
  classes: string[];
  includeOtherClasses: boolean;
  types: string[];
  buffs: string[];
  buffSearch: BuffSearchType;
  abilityTargetType: AbilityTargetType;
  excludeIds?: number[];
  hideBaseForms?: boolean;
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
    if (arg.types && arg.types.length) {
      filtered = filtered.filter(u => u.stats && arg.types.some(t => t === u.stats.type));
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
    if (arg.abilityTargetType) {
      switch (arg.abilityTargetType) {
        case 'crew':
          filtered = filtered.filter(u => this.targetsCrew(u.lvl5Ability));
          break;
        case 'type':
          filtered = filtered.filter(u => this.targetsTypes(u.lvl5Ability, u.type));
          break;
        case 'class':
          filtered = filtered.filter(u => this.targetsClasses(u.lvl5Ability, u.class1, u.class2));
          break;
        default:
          break;
      }
    }

    if (arg.excludeIds && arg.excludeIds.length) {
      const set = new Set(arg.excludeIds);
      filtered = filtered.filter(u => !set.has(u.id));
    }

    // we cant do pagination at this level because we need
    // the full filtered array to know the number of items/pages
    return filtered;
  }

  
  private targetsClasses(lvl5Ability: Effect[], class1: Classes, class2: Classes): unknown {
    return this.getTargetingEffects(lvl5Ability).some(e => e.targeting.targets.includes(class1) || e.targeting.targets.includes(class2));
  }
  
  private targetsTypes(lvl5Ability: Effect[], type: string): boolean {
    const color = `[${type}]` as Colors;
    return this.getTargetingEffects(lvl5Ability).some(e => e.targeting.targets.includes(color));
  }
  
  private targetsCrew(lvl5Ability: Effect[]): unknown {
    return this.getTargetingEffects(lvl5Ability).some(e => e.targeting.targets.includes('crew'));
  }

  private effectMatches(effects: Effect[], buffs: string[]): boolean {
    return buffs.every(buff => effects.some(effect =>
      effect.effect === 'buff' &&
      effect.attributes.some(attr => attr === buff)
    ));
  }

  private getTargetingEffects = (effects: Effect[]) => effects.filter(e => e.effect === 'buff' && e.targeting && e.targeting.targets);
}
