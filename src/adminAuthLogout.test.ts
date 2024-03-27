import {
  clear,
  adminAuthRegister,
  adminAuthLogin,
  adminUserDetails,
  adminUserDetailsUpdate,
  adminUserPasswordUpdate,
  adminAuthLogout
} from './testHelpers';

beforeEach(() => {
  clear();
});

describe('Testing POST /v1/admin/auth/logout', () => {
  let token: string;
  beforeEach(() => {
    const { jsonBody } = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');

    token = jsonBody.token;
  });

  test('Successful logout', () => {
    const { statusCode, jsonBody } = adminAuthLogout(token);

    expect(statusCode).toStrictEqual(200);
    expect(jsonBody).toStrictEqual({});

    expect(adminUserDetails(token)).toStrictEqual(
      {
        statusCode: 401,
        jsonBody: { error: expect.any(String) }
      }
    );

    // expect(adminUserDetailsUpdate(token, 'dunyao@unsw.edu.au', 'Sam', 'Jeong')).toStrictEqual(
    //   {
    //     statusCode: 401,
    //     jsonBody: { error: expect.any(String) }
    //   }
    // );

    // expect(adminUserPasswordUpdate(token, 'abcd1234', '1234abcd')).toStrictEqual(
    //   {
    //     statusCode: 400,
    //     jsonBody: { error: expect.any(String) }
    //   }
    // );
  });

  test('Successful logout with multiple sessions', () => {
    const { jsonBody: log } = adminAuthLogin('dunyao@unsw.edu.au', 'abcd1234');
    const { statusCode, jsonBody } = adminAuthLogout(token);

    expect(statusCode).toStrictEqual(200);
    expect(jsonBody).toStrictEqual({});

    expect(adminUserDetails(log.token)).toStrictEqual(
      {
        statusCode: 200,
        jsonBody: {
          user: {
            userId: expect.any(Number),
            name: 'DunYao Foo',
            email: 'dunyao@unsw.edu.au',
            numSuccessfulLogins: 2,
            numFailedPasswordsSinceLastLogin: 0,
          }
        }
      }
    );

    expect(adminUserDetailsUpdate(log.token, 'dunyao@unsw.edu.au', 'Sam', 'Jeong')).toStrictEqual(
      {
        statusCode: 200,
        jsonBody: {}
      }
    );

    expect(adminUserPasswordUpdate(log.token, 'abcd1234', '1234abcd')).toStrictEqual(
      {
        statusCode: 200,
        jsonBody: {}
      }
    );
  });

  test('Invalid token', () => {
    expect(adminAuthLogout('hello')).toStrictEqual(
      {
        statusCode: 401,
        jsonBody: { error: expect.any(String) }
      }
    );
  });
});
