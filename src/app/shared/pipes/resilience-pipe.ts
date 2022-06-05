import { Pipe, PipeTransform } from '@angular/core';
import { AttackPattern, Condition, DamageResilience, DebuffResilience, HealingResilience, HealPattern, Pattern, Resilience } from '../models/rumble';

@Pipe({
  name: 'resilience'
})
export class ResiliencePipe implements PipeTransform {

  transform(value: Resilience, ...args: unknown[]): string {
    if (!value) {
      return '';
    }

    const conditionText = value.condition ? `${this.getConditionText(value.condition)}, ` : '';

    const resilienceText = this.getResilienceText(value);

    return `${conditionText}${resilienceText}`;
  }

  private getResilienceText(r: Resilience): string {
    switch (r.type) {
      case 'damage':
        const dmgr = r as DamageResilience;
        return `${dmgr.percentage || '?'}% reduction to ${dmgr.attribute || '?'} damage.`;
      case 'debuff':
        const dbfr = r as DebuffResilience;
        return `${dbfr.chance || '?'}% to resist ${dbfr.attribute || '?'}.`;
      case 'healing':
        const hr = r as HealingResilience;
        return `Heals ${hr.amount || '?'} HP every ${hr.interval || '?'} seconds.`;
      default:
        console.warn('unexpected resilience type' + r.type, r);
        return 'unknown';
    }
  }

  private getConditionText(condition: Condition): string {
    return `When ${condition.stat || '?'} is ${condition.comparator || '?'} ${condition.count || '?'}`;
  }
}
