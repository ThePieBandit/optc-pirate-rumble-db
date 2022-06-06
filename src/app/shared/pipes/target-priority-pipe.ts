import { Pipe, PipeTransform } from '@angular/core';
import { TargetClass } from '../models/rumble';

@Pipe({
  name: 'targetPriority'
})
export class TargetPriorityPipe implements PipeTransform {

  transform(value: TargetClass, ...args: unknown[]): string {
    if (!value) {
      return '';
    }

    switch (value.criteria) {
      case 'near':
        return 'Nearby enemies';
      default:
        return `Enemies with the ${value.comparator} ${value.criteria}`;
    }
  }
}
