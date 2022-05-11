import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
  pure: false
})
export class SortPipe implements PipeTransform {

  transform(value: any, prop: string = 'name'): any {
    if (value.length < 2) {
      return value;
    }
    return (value as []).sort((a, b) => {
      if (a[prop] === b[prop]) return 0;
      return a[prop] > b[prop] ? 1 : -1;
    });
  }

}
