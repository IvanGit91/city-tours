import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'formatDataPipe'})
export class FormatDataPipe implements PipeTransform {
  transform(value: number[]): string {
    // If the year is the first element, then invert the array to format it correctly
    let arrayToReturn = (value != null && value[0].toString().length === 4) ? value.reverse() : value;
    return arrayToReturn != null ? arrayToReturn.join("/") : null;
  }
}
