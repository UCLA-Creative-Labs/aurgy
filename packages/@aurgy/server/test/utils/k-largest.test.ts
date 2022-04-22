import { kLargest } from '../../utils';

const compareNumbers = (a: number, b: number) => a < b ? -1 : 1;

describe('Testing K Largest', () => {
  test('on ordered array', () => {
    // GIVEN
    const arr = [1, 2, 3, 4, 5, 6, 7, 8];

    // WHEN
    const fiveLargest = kLargest<number>(arr, compareNumbers, 4);

    // EXPECT
    expect(fiveLargest).toEqual(expect.arrayContaining([5, 6, 7, 8]));
  });

  test('on unordered array', () => {
    // GIVEN
    const arr = [7, 6, 3, 4, 2, 1, 5, 8];

    // WHEN
    const fiveLargest = kLargest<number>(arr, compareNumbers, 4);

    // EXPECT
    expect(fiveLargest).toEqual(expect.arrayContaining([5, 6, 7, 8]));
  });
});
