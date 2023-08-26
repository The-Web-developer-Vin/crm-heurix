import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'months',
})
export class MonthsPipe implements PipeTransform {
    transform(value: any, ...args: unknown[]): unknown {
        if (value === 1) {
            return 'Jan';
        } else if (value === 2) {
            return 'Feb';
        } else if (value === 3) {
            return 'Mar';
        } else if (value === 4) {
            return 'Apr';
        } else if (value === 5) {
            return 'May';
        } else if (value === 6) {
            return 'Jun';
        } else if (value === 7) {
            return 'Jul';
        } else if (value === 8) {
            return 'Aug';
        } else if (value === 9) {
            return 'Sept';
        } else if (value === 10) {
            return 'Oct';
        } else if (value === 11) {
            return 'Nov';
        } else if (value === 12) {
            return 'Dec';
        }
        return null;
    }
}
