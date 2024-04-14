import { adminUserDetails } from './v2testHelpers';
import {
  clear,
  adminAuthRegister,
  adminAuthLogin
} from '../iteration2Tests/testHelpers';
import HTTPError from 'http-errors';

let token: string;
beforeEach(() => {
  clear();

  token = adminAuthRegister('Dilhanm@gmail.com', 'abCdddD123', 'Dilhan', 'Mert').token;
});

describe('Testing GET /v1/admin/user/details', () => {
  test('Correct retrieves details', () => {
    expect(adminUserDetails(token)).toStrictEqual(
      {
        user: {
          userId: expect.any(Number),
          name: 'Dilhan Mert',
          email: 'Dilhanm@gmail.com',
          numSuccessfulLogins: 1,
          numFailedPasswordsSinceLastLogin: 0,
        }
      }
    );
  });

  test('Invalid token', () => {
    expect(() => adminUserDetails('nuhuhwrongwrong')).toThrow(HTTPError[401]);
  });

  test('Retrieves correct user details', () => {
    const token2 = adminAuthRegister('DunYao@hotmail.com', 'abCdddD123', 'DunYao', 'Foo').token

    expect(adminUserDetails(token2)).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'DunYao Foo',
        email: 'DunYao@hotmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
    })
  });

  test('Correct numSuccessfulLogins', () => {
    for (let i = 0; i < 4; i++) {
      adminAuthLogin('Dilhanm@gmail.com', 'abCdddD123');
    }

    expect(adminUserDetails(token)).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Dilhan Mert',
        email: 'Dilhanm@gmail.com',
        numSuccessfulLogins: 5,
        numFailedPasswordsSinceLastLogin: 0,
      }
    })
  });

  test('Correct numFailedPasswordsSinceLastLogin', () => {
    for (let i = 0; i < 3; i++) {
      expect(() => adminAuthLogin('Dilhanm@gmail.com', 'abCddddD1232')).toThrow(HTTPError[400]);
    }

    expect(adminUserDetails(token)).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Dilhan Mert',
        email: 'Dilhanm@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 3,
      }
    })

  });
});
