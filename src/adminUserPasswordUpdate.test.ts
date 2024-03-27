import {
  clear,
  adminAuthRegister,
  adminAuthLogin,
  adminUserPasswordUpdate,
} from './testHelpers';

beforeEach(() => {
  clear();
});

describe('Testing PUT /v1/admin/user/password', () => {
  test('Comprehensive Test Successful: Logging on after changing the password', () => {
    let response = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
    const token = response.jsonBody.token;

    response = adminUserPasswordUpdate(token, 'abcd1234', 'efgh5678');
    expect(response).toStrictEqual({
      jsonBody: {},
      statusCode: 200,
    });

    expect(adminAuthLogin('abcd.efgh@gmail.com', 'efgh5678')).toStrictEqual({
      jsonBody: {
        token: expect.any(String),
      },
      statusCode: 200,
    });
  });

  test('Test Successful Password Update', () => {
    const response = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
    const token = response.jsonBody;
    const passwordChange = adminUserPasswordUpdate(token.token, 'abcd1234', 'efgh5678');

    expect(passwordChange).toStrictEqual({
      jsonBody: {},
      statusCode: 200,
    });
  });

  test('Comprehensive Test Successful: Changing Passwords a bunch of times and checking if it works by logging in', () => {
    let response = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
    const token = response.jsonBody.token;

    response = adminUserPasswordUpdate(token, 'abcd1234', 'efgh5678');
    expect(response).toStrictEqual({
      jsonBody: {},
      statusCode: 200,
    });

    response = adminUserPasswordUpdate(token, 'efgh5678', 'password1234');
    expect(response).toStrictEqual({
      jsonBody: {},
      statusCode: 200,
    });

    response = adminUserPasswordUpdate(token, 'password1234', 'fortress9871');
    expect(response).toStrictEqual({
      jsonBody: {},
      statusCode: 200,
    });

    response = adminUserPasswordUpdate(token, 'fortress9871', 'columbus1071');
    expect(response).toStrictEqual({
      jsonBody: {},
      statusCode: 200,
    });

    response = adminUserPasswordUpdate(token, 'columbus1071', 'pirate981');
    expect(response).toStrictEqual({
      jsonBody: {},
      statusCode: 200,
    });

    expect(adminAuthLogin('abcd.efgh@gmail.com', 'pirate981')).toStrictEqual({
      jsonBody: {
        token: expect.any(String)
      },
      statusCode: 200,
    });
  });

  test('Comprehensive Test Unsuccessful: Trying to log in after trying to change to an invalid pass', () => {
    let response = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
    response = adminUserPasswordUpdate(response.jsonBody.token, 'abcd1234', 'abcd1234');

    expect(response).toStrictEqual({
      jsonBody: {
        error: expect.any(String)
      },
      statusCode: 400,
    });

    response = adminAuthLogin('abcd.efgh@gmail.com', 'abcd1234');

    expect(response).toStrictEqual({
      jsonBody: {
        token: expect.any(String)
      },
      statusCode: 200,
    });
  });

  test('Test Unsuccessful: Token invalid', () => {
    adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh').jsonBody;
    const response = adminUserPasswordUpdate('', 'abcd1234', 'efgh5678');

    expect(response).toStrictEqual({
      jsonBody: {
        error: expect.any(String)
      },
      statusCode: 401,
    });
  });

  test('Test Unsuccessful: Old Password Incorrect', () => {
    const token = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh').jsonBody;
    const response = adminUserPasswordUpdate(token.token, 'aecd1234', 'efgh5678');

    expect(response).toStrictEqual({
      jsonBody: {
        error: expect.any(String)
      },
      statusCode: 400,
    });
  });

  test('Test Unsuccessful: Passwords are the Same', () => {
    const token = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh').jsonBody;
    const response = adminUserPasswordUpdate(token.token, 'abcd1234', 'abcd1234');

    expect(response).toStrictEqual({
      jsonBody: {
        error: expect.any(String)
      },
      statusCode: 400,
    });
  });

  test('Test Unsuccessful: New Password Matches Old Password', () => {
    const token = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh').jsonBody;
    adminUserPasswordUpdate(token.token, 'abcd1234', 'efgh5678');
    const response = adminUserPasswordUpdate(token.token, 'efgh5678', 'abcd1234');

    expect(response).toStrictEqual({
      jsonBody: {
        error: expect.any(String)
      },
      statusCode: 400,
    });
  });

  test('Test Unsuccessful: Password less than 8 charachters', () => {
    const token = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh').jsonBody;
    const response = adminUserPasswordUpdate(token.token, 'abcd1234', 'efgh567');

    expect(response).toStrictEqual({
      jsonBody: {
        error: expect.any(String)
      },
      statusCode: 400,
    });
  });

  test('Test Unsuccessful: Password does not contain at least one number and at least one letter', () => {
    const token = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh').jsonBody;
    const response = adminUserPasswordUpdate(token.token, 'abcd1234', '***********');

    expect(response).toStrictEqual({
      jsonBody: {
        error: expect.any(String)
      },
      statusCode: 400,
    });
  });
});
