import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'uppercaseAddTextPipe'})
export class UppercaseAddTextPipe implements PipeTransform {
  transform(value: string, prefix: string): string {
    return prefix.toUpperCase() + "." + value.toUpperCase();
  }
}
