import fixtures from '../test/fixtures';
import subject from './';

describe('Main', () => {
  describe('Processing given inputs produces the expected results', () => {
    fixtures.forEach(fixture => {
      test(fixture.description, () => expect(subject(fixture.inputs)).toEqual(fixture.expectations));
    });
  });
});
