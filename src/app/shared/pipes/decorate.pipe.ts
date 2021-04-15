import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decorate'
})
export class DecoratePipe implements PipeTransform {

  transform(s: string): string {
    if (s === null || s === ''){
      return s;
    }
    return s.replace(/\[?STR\]?/, this.getImageString('filter_attribute_power'))
            .replace(/\[?DEX\]?/, this.getImageString('filter_attribute_technical'))
            .replace(/\[?QCK\]?/, this.getImageString('filter_attribute_speed'))
            .replace(/\[?PSY\]?/, this.getImageString('filter_attribute_heart'))
            .replace(/\[?INT\]?/, this.getImageString('filter_attribute_intellect'))
            .replace(/\[?DUAL\]?/, this.getImageString('filter_attribute_multiplecharacter'))
            ;
    }

  getImageString(s: string): string
  {
    return '<img src="assets/images/' + s + '.png" width="auto" height="30px"/>';
  }
}
