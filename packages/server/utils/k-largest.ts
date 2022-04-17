import { quickSelect } from '.';
import { Comparator } from './quick-select';

export function kLargest<T>(arr: T[], cmp: Comparator<T>, k: number): T[] {
  if (k >= arr.length) return arr;
  const pivot = quickSelect(arr, cmp, k);
  return arr.filter(v => cmp(v, pivot) > 0);
}
