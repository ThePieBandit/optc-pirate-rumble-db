import 'intl-list-format';
import 'intl-list-format/locale-data/en';
import { Pipe, PipeTransform } from '@angular/core';
import { Effect } from '../models/rumble';
import { ConditionPipe } from './condition.pipe';

declare namespace Intl {
  function getCanonicalLocales(locales: string | string[]): string[];

  interface ListFormatOptions{
    style?: string;
    type?: string;
  }

  class ListFormat {
    constructor(locales?: string | string[], options?: Intl.ListFormatOptions);
    public format: (items: string[]) => string;
  }

  class NumberFormat {
    constructor();
    format(a: any): any;
  }
}

const numberFormatter: Intl.NumberFormat = new Intl.NumberFormat();
const listFormatter: Intl.ListFormat = new Intl.ListFormat();

@Pipe({
  name: 'effect'
})
export class EffectPipe implements PipeTransform {
  conditionPipe: ConditionPipe;

  constructor() {
    this.conditionPipe = new ConditionPipe();
  }

  transform(effect: Effect): string {
    let e = '';
    const condition = this.conditionPipe.transform(effect.condition);
    if (condition) {
      e += `${condition}, `;
    }
    switch (effect.effect) {
      case 'buff':
        e += 'Applies Lv.' + effect.level + ' ' + this.arrayToString(effect.attributes) + ' up buff';
        break;
      case 'debuff':
        e += 'Inflicts Lv.' + effect.level + ' ' + this.arrayToString(effect.attributes) + ' down debuff';
        break;
      case 'damage':
        switch (effect.type) {
          case 'time':
            e += 'Deals Lv.' + effect.level + ' Damage Over Time';
            break;
          case 'atk':
            e += 'Deals ' + numberFormatter.format(effect.amount) + 'x ATK in damage';
            if (effect.defbypass) {
              e += ' that will ignore DEF'
            }
            break;
          case 'fixed':
            e += 'Deals ' + numberFormatter.format(effect.amount) + ' fixed damage';
            break;
          case 'cut':
            e += numberFormatter.format(effect.amount) + '% health cut';
            break;
          case 'atkbase':
            e += `Deals ${effect.amount}x `;
            if (effect.leader) {
              e += "Leader's ";
            }
            e += 'base ATK in damage';
            break;
          case 'random':
            if (effect.amountrange == null || effect.amountrange.length != 2) {
              console.warn('expected amountrange to have 2 entries', effect);
              e += 'Randomly deals fixed damage';
            } else {
              e += `Randomly deals between ${effect.amountrange[0]}-${effect.amountrange[1]} fixed damage`;
            }
            break;
          default:
            e += 'TODO:  ' + JSON.stringify(effect);
        }
        break;
      case 'recharge':
        switch (effect.type) {
          case 'RCV':
            e += 'Restores ' + numberFormatter.format(effect.amount) + 'x RCV of HP';
            break;
          case 'percentage':
            e += 'Restores ' + numberFormatter.format(effect.amount) + '% of HP';
            break;
          case 'fixed':
            e += 'Restores ' + numberFormatter.format(effect.amount) + ' fixed HP';
            break;
          case 'Special CT':
            e += 'Reduces ' + numberFormatter.format(effect.amount) + '% of ' + effect.type;
            break;
          default:
            e += 'TODO:  ' + JSON.stringify(effect);
        }
        break;
      case 'hinderance':
        if (effect.chance) {
          e += effect.chance + '% chance to ' + this.arrayToString(effect.attributes);
        } else if (effect.amount) {
          e += `Removes ${effect.amount}% of ${this.arrayToString(effect.attributes)}`;
        } else {
          console.warn('unexpected hinderance effect', effect);
        }
        break;
      case 'boon':
        const boonPrefix = 'chance' in effect ? effect.chance + '% chance to ' : '';
        const boonEffects = this.arrayToString(effect.attributes);
        let boonMessage = '';
        switch (boonEffects) {
          case 'Provoke':
          case 'Counter':
          case 'Revive':
          case 'Haste':
            boonMessage = `apply ${boonEffects}`;
            if (effect.amount != null && boonEffects === 'Counter') {
              boonMessage += ` (${effect.amount}x ATK)`;
            }
            if (effect.amount != null && boonEffects === 'Revive') {
              boonMessage += ` (${effect.amount}% HP)`;
            }
            break;
          default:
            boonMessage = `reduce ${boonEffects}`;
        }
        e += boonPrefix.concat(boonMessage);
        break;
      case 'penalty':
        const tmpStr = this.arrayToString(effect.attributes);
        if (tmpStr === 'HP' && 'amount' in effect) {
          e += numberFormatter.format(effect.amount) + '% health cut';
        }
        else if ('level' in effect) {
          e += 'Inflicts Lv.' + numberFormatter.format(effect.level) + ' ' + this.arrayToString(effect.attributes) + ' down penalty';
        }
        else {
          e += (effect.chance || 100) + '% chance to ' + this.arrayToString(effect.attributes);
        }
        break;
      case 'cleanse':
        if (effect.chance) {
          e += `${effect.chance}% chance to cleanse`;
        } else {
          e += `cleanses`;
        }
        e += ` ${this.arrayToString(effect.attributes)} debuffs`;
        break;
      default:
        e += 'UNKNOWN EFFECT ' + JSON.stringify(effect);
        break;
    }
    
    e += this.targetToString(effect.targeting) + this.rangeToString(effect.range);

    if (effect.duration) {
      e += ` for ${numberFormatter.format(effect.duration)}s`;
    }
    
    if (effect.repeat && effect.repeat > 1) {
      e += ` ${effect.repeat} times`;
    }

    return `${this.capitalizeFirst(e)}.`;
  }

  arrayToString(array: any): string {
    return listFormatter.format(array);
  }

  rangeToString(range): string {
    if (!range) { return ''; }
    return ' in a ' + range.size + ', ' + range.direction + ' range';
  }

  targetToString(target): string {
    if (!target) { return ''; }
    let targetStr = this.arrayToString(target.targets);
    if (targetStr === 'crew') { targetStr = 'crew member(s)'; }
    if (targetStr === 'enemies') {
      if (!target.count) {
        targetStr = 'all enemies';
      }
      else if (target.count === 1) {
        targetStr = 'enemy';
      }
    }

    const to = ' to ' + ('count' in target ? target.count + ' ' : '') + targetStr;

    if (target.percentage && target.priority && target.stat) {
      switch (target.priority) {
        case 'exactly':
          return `${to} with ${target.priority} ${target.percentage}% ${target.stat}`;
        default:
          return `${to} with a ${target.percentage}% or ${target.priority} ${target.stat}`;
      }
    }

    return to + ('stat' in target ? ' with the ' + target.priority + ' ' + target.stat : '');
  }

  capitalizeFirst(str: string): string {
    return str && str.charAt(0).toUpperCase().concat(str.slice(1));
  }
}
