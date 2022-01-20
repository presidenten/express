import helpers from './helpers';

describe('helpers', () => {
  describe('sleep', () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    it('should sleep correct amount of time', (done) => {
      jest.useFakeTimers();
      helpers.sleep(1000).then(() => {
        done();
      })
      jest.advanceTimersByTime(1000);
    });
  });
});
