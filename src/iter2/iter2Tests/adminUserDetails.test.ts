import {
  clear,
  adminAuthRegister,
  adminUserDetails,
  adminAuthLogin,
} from './testHelpers';

let token: string;
beforeEach(() => {
  clear();

  token = adminAuthRegister('Dilhanm@gmail.com', 'abCdddD123', 'Dilhan', 'Mert').jsonBody.token;
});

describe('Testing GET /v1/admin/user/details', () => {
  test('Correct retrieves details', () => {
    const { statusCode, jsonBody } = adminUserDetails(token);

    expect(statusCode).toStrictEqual(200);
    expect(jsonBody).toStrictEqual(
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
    expect(adminUserDetails('nuhuhwrongwrong')).toStrictEqual(
      {
        statusCode: 401,
        jsonBody: { error: expect.any(String) }
      }
    );
  });

  test('Retrieves correct user details', () => {
    const { jsonBody: reg2 } = adminAuthRegister('DunYao@hotmail.com', 'abCdddD123', 'DunYao', 'Foo');
    const token2 = reg2.token;
    const { statusCode, jsonBody } = adminUserDetails(token2);

    expect(statusCode).toStrictEqual(200);
    expect(jsonBody).toStrictEqual(
      {
        user: {
          userId: expect.any(Number),
          name: 'DunYao Foo',
          email: 'DunYao@hotmail.com',
          numSuccessfulLogins: 1,
          numFailedPasswordsSinceLastLogin: 0,
        }
      }
    );
  });

  test('Correct numSuccessfulLogins', () => {
    for (let i = 0; i < 4; i++) {
      const { statusCode: login } = adminAuthLogin('Dilhanm@gmail.com', 'abCdddD123');
      expect(login).toStrictEqual(200);
    }

    const { statusCode, jsonBody } = adminUserDetails(token);

    expect(statusCode).toStrictEqual(200);
    expect(jsonBody).toStrictEqual(
      {
        user: {
          userId: expect.any(Number),
          name: 'Dilhan Mert',
          email: 'Dilhanm@gmail.com',
          numSuccessfulLogins: 5,
          numFailedPasswordsSinceLastLogin: 0,
        }
      }
    );
  });

  test('Correct numFailedPasswordsSinceLastLogin', () => {
    for (let i = 0; i < 3; i++) {
      const { statusCode: login } = adminAuthLogin('Dilhanm@gmail.com', 'abCddddD1232');
      expect(login).toStrictEqual(400);
    }

    const { statusCode, jsonBody } = adminUserDetails(token);

    expect(statusCode).toStrictEqual(200);
    expect(jsonBody).toStrictEqual(
      {
        user: {
          userId: expect.any(Number),
          name: 'Dilhan Mert',
          email: 'Dilhanm@gmail.com',
          numSuccessfulLogins: 1,
          numFailedPasswordsSinceLastLogin: 3,
        }
      }
    );
  });
});
