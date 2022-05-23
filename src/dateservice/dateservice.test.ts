import { DateService } from './dateservice';

describe('dateservice', () => {
  test('it should return a date', () => {
    const dateService = new DateService();
    expect(dateService.now()).toBeInstanceOf(Date);
    expect(+dateService.now() - 100).toBeLessThan(+new Date());
    expect(+dateService.now() + 100).toBeGreaterThan(+new Date());
  });
});
