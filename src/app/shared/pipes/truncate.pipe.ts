import { Pipe, PipeTransform } from '@angular/core';

const MAX_LENGTH = 35;

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(s: string): string {
    if (s.length < MAX_LENGTH){
      return s;
    }
    // return '<span matTooltip="'+s+'">'+s.substring(0,37)+'...</span>';
    return s.substring(0, MAX_LENGTH - 3) + '...';
    }
}
