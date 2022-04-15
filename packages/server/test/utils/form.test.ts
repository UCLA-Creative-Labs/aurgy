import {objectToForm} from '../../utils';

describe('Testing Form Conversion', () => {
  test('on empty object', () => {
    // GIVEN
    const obj = {};

    // WHEN
    const form = objectToForm(obj);

    // EXPECT
    expect(form).toBe('');
  });

  test('on single key object', () => {
    // GIVEN
    const obj = {
      bryan: 'amazing',
    };

    // WHEN
    const form = objectToForm(obj);

    // EXPECT
    expect(form).toBe('bryan=amazing');
  });

  test('on multi key object', () => {
    // GIVEN
    const obj = {
      bryan: 'amazing',
      cl: 'dope',
      techTeam: 'bestTeam',
    };

    // WHEN
    const form = objectToForm(obj);

    // EXPECT
    expect(form).toBe('bryan=amazing&cl=dope&techTeam=bestTeam');
  });

  test('on object w/ number', () => {
    // GIVEN
    const obj: Record<string, any> = {
      bryan: 0,
      cl: 'dope',
      techTeam: 'bestTeam',
    };

    // WHEN
    const form = objectToForm(obj);

    // EXPECT
    expect(form).toBe('bryan=0&cl=dope&techTeam=bestTeam');
  });
});
