import {
  clear,
  adminAuthRegister,
  adminAuthLogin,
  adminUserDetails,
  adminUserDetailsUpdate,
  adminUserPasswordUpdate,
  adminAuthLogout
} from './testHelpers';

let token: string;
beforeEach(() => {
  clear();

  token = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo').jsonBody.token;
});

describe('Testing POST /v1/admin/auth/logout', () => {
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

    expect(adminUserDetailsUpdate(token, 'dunyao@unsw.edu.au', 'Sam', 'Jeong')).toStrictEqual(
      {
        statusCode: 401,
        jsonBody: { error: expect.any(String) }
      }
    );

    expect(adminUserPasswordUpdate(token, 'abcd1234', '1234abcd')).toStrictEqual(
      {
        statusCode: 401,
        jsonBody: { error: expect.any(String) }
      }
    );
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
    expect(adminAuthLogout(token + 'hello')).toStrictEqual(
      {
        statusCode: 401,
        jsonBody: { error: expect.any(String) }
      }
    );
  });
});
