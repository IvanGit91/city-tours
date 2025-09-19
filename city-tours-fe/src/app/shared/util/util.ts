export namespace Util {

  export type Event = 'ADD' | 'EDIT' | 'DELETE';

  export enum Events {
    ADD = 'ADD',
    EDIT = 'EDIT',
    DELETE = 'DELETE'
  }

  export function format(subj: string, keyValue: Array<{ key: string; value: string; }>): string {
    for (const objKeyValue of keyValue) {
      subj = subj.replace(new RegExp('\\{' + objKeyValue.key + '\\}', 'g'), encodeURIComponent(objKeyValue.value));
    }
    return subj;
  }

  export function dateToMySqlDateTime(objDate: Date): string {
    function twoDigits(d) {
      if (0 <= d && d < 10) {
        return '0' + d.toString();
      }
      if (-10 < d && d < 0) {
        return '-0' + (-1 * d).toString();
      }
      return d.toString();
    }

    return objDate.getFullYear() + '-' + twoDigits(1 + objDate.getMonth()) + '-' + twoDigits(objDate.getDate()) + ' ' + twoDigits(objDate.getHours()) + ':' + twoDigits(objDate.getMinutes()) + ':' + twoDigits(objDate.getSeconds());
  }

}
