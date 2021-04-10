import { Pipe, PipeTransform } from '@angular/core';
import { AttackPattern, HealPattern, Pattern } from '../models/rumble';

@Pipe({
  name: 'pattern'
})
export class PatternPipe implements PipeTransform {

  transform(value: Pattern[], ...args: unknown[]): unknown {
    if (!value || !value.length) {
      return '';
    }
    return value.map(pattern => `<li>${this.getPatternString(pattern)}</li>`).join('');
  }

  private getPatternString(pattern: Pattern): string {
    switch (pattern.action) {
      case 'attack':
        const attackPattern = pattern as AttackPattern;
        return `Attack (${attackPattern.type})`;
      case 'heal':
        const healPattern = pattern as HealPattern;
        return `Level ${healPattern.level} heal (${healPattern.area})`;
      default:
        console.error('unexpected pattern.action on pattern', pattern);
        return '';
    }
  }
}
