import { Pipe, PipeTransform } from '@angular/core';
import * as rumble from '../../shared/models/rumble';

export type BuffSearchType = 'both' | 'ability' | 'special';

export interface UnitFilterArgs {
  filter: string;
  classes: string[];
  includeOtherClasses: boolean;
  types: string[];
  buffs: string[];
  buffSearch: BuffSearchType;
  excludeIds?: number[];
}

@Pipe({
  name: 'unitFilter',
  pure: false,
})
export class UnitFilterPipe implements PipeTransform {

  transform(value: rumble.Unit[], ...args: UnitFilterArgs[]): rumble.Unit[] {
    const arg = args && args[0];
    if (!arg) {
      return value.slice(0, 10);
    }

    let filtered = value;
    const nameFilter = arg.filter && arg.filter.toLowerCase();
    if (nameFilter) {
      // TODO: filter also by "Others" when available
      // eg for unit 2034 it should be
      // Super Borsalino,Mega Borsalino,Borsalino V1,Super Kizaru,Kizaru,Mega Kizaru,6+ Kizaru
      filtered = filtered.filter(u => u.name.toLowerCase().includes(nameFilter));
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
    if (arg.excludeIds && arg.excludeIds.length) {
      const set = new Set(arg.excludeIds);
      filtered = filtered.filter(u => !set.has(u.id));
    }

    // we cant do pagination at this level because we need
    // the full filtered array to know the number of items/pages
    return filtered;
  }

  private effectMatches(effects: rumble.Effect[], buffs: string[]): boolean {
    return buffs.every(buff => effects.some(effect =>
      effect.effect === 'buff' &&
      effect.attributes.some(attr => attr === buff)
    ));
  }
}
