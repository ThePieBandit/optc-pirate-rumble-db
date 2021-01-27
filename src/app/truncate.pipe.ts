import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(s: string): string {
    if (s.length < 40){
      return s;
    }
    // return '<span matTooltip="'+s+'">'+s.substring(0,37)+'...</span>';
    return s.substring(0, 37) + '...';
    }
}
