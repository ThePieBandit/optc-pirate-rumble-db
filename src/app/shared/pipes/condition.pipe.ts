import 'intl-list-format';
import 'intl-list-format/locale-data/en';
import { Pipe, PipeTransform } from '@angular/core';
import { Condition } from '../models/rumble';

declare namespace Intl {
  interface ListFormatOptions{
    style?: string;
    type?: string;
  }

  class ListFormat {
    constructor(locales?: string | string[], options?: Intl.ListFormatOptions);
    public format: (items: string[]) => string;
  }
}

const orListFormatter: Intl.ListFormat = new Intl.ListFormat(undefined, { type: 'disjunction' });

@Pipe({
  name: 'condition'
})
export class ConditionPipe implements PipeTransform {

  transform(condition: Condition): string {
    if (!condition) { return ''; }

    switch (condition.type) {
      case 'stat':
        return 'When ' + condition.stat + ' is ' + condition.comparator + ' ' + condition.count + '%';
      case 'time':
        switch (condition.comparator) {
          case 'first':
            return 'For the first ' + condition.count + ' seconds';
          case 'after':
            return 'After the first ' + condition.count + ' seconds';
          case 'remaining':
            return 'For the last ' + condition.count + ' seconds';
          default:
            return 'UNKNOWN TIME CONDITION ' + JSON.stringify(condition);
        }
      case 'crew':
      case 'enemies':
        return 'When ' + condition.type + ' count is ' + condition.count + ' or ' + condition.comparator;
      case 'trigger':
        return 'When this unit does a ' + condition.stat + ' (limit ' + condition.count + ')';
      case 'character':
        return `When ${orListFormatter.format(condition.families)} is on ${condition.team}`;
      case 'defeat':
        return `When ${condition.count} characters on ${condition.team === 'crew' ? 'your crew' : 'the enemy crew'} are defeated`;
      case 'guard':
      case 'heal':
        return `After ${condition.type}ing ${condition.count} times`;
      case 'dmgreceived':
        return `After receiving ${condition.count} damage`;
      case 'debuff':
        return `After doing ${condition.attribute} ${condition.count} times`;
      case 'dbfreceived':
        return `After receiving status effects ${condition.count} times`;
      case 'damage':
      case 'hit':
        return `After dealing damage ${condition.count} times`;
      case 'attack':
        if (condition.attack) {
          return `After ${condition.count} ${condition.attack} attacks`;
        }
        return `After receiving damage ${condition.count} times`;
      case 'special':
        if (!condition.team) {
          return `When ${condition.count} specials are used`;
        }

        return `When ${condition.team} uses specials ${condition.count} times`;
      default:
        return 'UNKNOWN CONDITION ' + JSON.stringify(condition);
    }
  }
}
