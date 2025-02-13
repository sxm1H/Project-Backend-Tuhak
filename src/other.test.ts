import { clear, adminAuthRegister } from './iteration2Tests/testHelpers';

beforeEach(() => {
  clear();
});

describe('Testing DELETE /v1/clear', () => {
  test('Successful login after clear of same id', () => {
    expect(adminAuthRegister('nick@gmail.com', 'nick12345', 'Nicholas', 'Sebastian')).toStrictEqual(
      { token: expect.any(String) }
    );

    clear();

    // Should expect id to be a number, since we made the same exact profile after clearing data.
    expect(adminAuthRegister('nick@gmail.com', 'nick12345', 'Nicholas', 'Sebastian')).toStrictEqual(
      { token: expect.any(String) }
    );
  });
});
