export type Comparator<T> = (a: T, b: T) => number

/**
 * Select the k biggest element in an array
 *
 * @param arr the array to select
 * @param cmp if a < b then return -1 else return 1
 * @param k the number k
 * @returns the k biggest
 */
export function quickSelect<T>(arr: T[], cmp: Comparator<T>, k: number): T {

  function quickSelectHelper(left: number, right: number): T {
    const pos = partition(arr, cmp, left, right);
    if (pos === k - 1) return arr[pos];
    else if (pos < k - 1) return quickSelectHelper(pos + 1, right);
    else return quickSelectHelper(left, pos -1);
  }

  return quickSelectHelper(0, arr.length - 1);
}

function partition<T>(arr: T[], cmp: Comparator<T>, left: number, right: number) {
  const pivot = arr[right];
  let pivot_i = left;
  for (let i = left; i < right; i++) {
    if (cmp(arr[i], pivot) > 0) {
      [arr[i], arr[pivot_i]] = [arr[pivot_i], arr[i]];
      pivot_i++;
    }
  }
  [arr[right], arr[pivot_i]] = [arr[pivot_i], arr[right]];
  return pivot_i;
}
