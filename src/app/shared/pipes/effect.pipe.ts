import 'intl-list-format';
import 'intl-list-format/locale-data/en';
import { Pipe, PipeTransform } from '@angular/core';
import { Effect } from '../models/rumble';

declare namespace Intl {
    function getCanonicalLocales(locales: string | string[]): string[];

    class ListFormat {
        constructor();

        format(a: any): any;
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

  transform(effect: Effect): string {
    let e = '<li>';
    e += this.conditionToString(effect.condition);
    switch (effect.effect) {
      case 'buff':
        e += 'Applies Lv.' + effect.level + ' ' + this.arrayToString(effect.attributes) + ' up buff';
        break;
      case 'debuff':
        e += 'Inflicts Lv.' + effect.level + ' ' + this.arrayToString(effect.attributes) + ' down debuff';
        break;
      case 'damage':
        switch (effect.type){
          case 'time':
            e += 'Deals Lv.' + effect.level + ' Damage Over Time';
            break;
          case 'atk':
            e += 'Deals ' + numberFormatter.format(effect.amount) + 'x ATK in damage';
            break;
          case 'fixed':
            e += 'Deals ' + numberFormatter.format(effect.amount) + 'x ATK in damage';
            break;
          case 'cut':
            e += numberFormatter.format(effect.amount) + '% health cut';
            break;
          default:
            e += 'TODO:  ' + JSON.stringify(effect);
        }
        break;
      case 'recharge':
        switch (effect.type){
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
        e += ('chance' in effect ? effect.chance + '% chance to ' : '') + ('Provoke' === this.arrayToString(effect.attributes) ? 'Provoke enemies' : 'reduce ' + this.arrayToString(effect.attributes));
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
          e += effect.chance + '% chance to ' + this.arrayToString(effect.attributes);
 }
        break;
      default:
        e += 'UNKNOWN EFFECT ' + JSON.stringify(effect);
        break;
    }
    e += this.targetToString(effect.targeting) + this.rangeToString(effect.range)
         + ('duration' in effect  ? ' for ' + numberFormatter.format(effect.duration) + 's' : '') + '.';
    e += '</li>';
    return e;
  }

  arrayToString(array: any): string {
    const tmpStr = listFormatter.format(array);
    return tmpStr;
  }

  conditionToString(condition): string {
    if (!condition) { return ''; }

    switch (condition.type){
      case 'stat':
        return 'When ' + condition.stat + ' is ' + condition.comparator + ' ' + condition.count + '%, ';
      case 'time':
        switch (condition.comparator){
          case 'first':
            return 'For the first ' + condition.count + ' seconds, ';
          case 'after':
            return 'After the first ' + condition.count + ' seconds, ';
          case 'remaining':
            return 'For the last ' + condition.count + ' seconds, ';
          default:
            return 'UNKNOWN TIME CONDITION ' + JSON.stringify(condition);
        }
      case 'crew':
      case 'enemies':
        return 'When ' + condition.type + ' count is ' + condition.count + ' or ' + condition.comparator + ', ';
      case 'trigger':
        return 'When this unit does a ' + condition.stat + ' (limit ' + condition.count + '), ';
      default:
        return 'UNKNOWN CONDITION ' + JSON.stringify(condition);
    }
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
      return `${to} with a ${target.percentage}% or ${target.priority} ${target.stat}`;
    }

    return to + ('stat' in target ? ' with the ' + target.priority + ' ' + target.stat : '');
  }
}
