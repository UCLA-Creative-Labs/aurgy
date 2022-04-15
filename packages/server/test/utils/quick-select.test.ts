import {quickSelect} from '../../utils';

const compareNumbers = (a: number, b: number) => a < b ? -1 : 1;

describe('Testing Quick Select', () => {
  test('on ordered array', () => {
    // GIVEN
    const arr = [1, 2, 3, 4, 5, 6, 7, 8];

    // WHEN
    const fifthSmallest = quickSelect<number>(arr, compareNumbers, 4);

    // EXPECT
    expect(fifthSmallest).toBe(5);
  });

  test('on unordered array', () => {
    // GIVEN
    const arr = [7, 6, 3, 4, 2, 1, 5, 8];

    // WHEN
    const fifthSmallest = quickSelect<number>(arr, compareNumbers, 4);

    // EXPECT
    expect(fifthSmallest).toBe(5);
  });
});
