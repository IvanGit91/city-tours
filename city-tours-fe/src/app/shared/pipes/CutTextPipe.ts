import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'cutText'})
export class CutTextPipe implements PipeTransform {
  transform(value: string, valueLength?: number): string {
    valueLength = valueLength === undefined || valueLength === null ? 50 : valueLength;
    return value != null && value.length > valueLength ? value.substr(0, valueLength) + '...' : value;
  }
}
