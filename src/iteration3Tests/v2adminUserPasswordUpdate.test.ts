import { adminUserPasswordUpdate } from './v2testHelpers';
import {
  clear,
  adminAuthRegister,
  adminAuthLogin
} from '../iteration2Tests/testHelpers';
import HTTPError from 'http-errors';

let token: string;
beforeEach(() => {
  clear();

  token = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh').token;
});

describe('Testing PUT /v1/admin/user/password', () => {
  test('Comprehensive Test Successful: Logging on after changing the password', () => {
    expect(adminUserPasswordUpdate(token, 'abcd1234', 'efgh5678')).toStrictEqual({});

    expect(adminAuthLogin('abcd.efgh@gmail.com', 'efgh5678')).toStrictEqual({ token: expect.any(String) });
  });

  test('Test Successful Password Update', () => {
    const passwordChange = adminUserPasswordUpdate(token, 'abcd1234', 'efgh5678');

    expect(passwordChange).toStrictEqual({});
  });

  test('Comprehensive Test Successful: Changing Passwords a bunch of times and checking if it works by logging in', () => {
    expect(adminUserPasswordUpdate(token, 'abcd1234', 'efgh5678')).toStrictEqual({});

    expect(adminUserPasswordUpdate(token, 'efgh5678', 'password1234')).toStrictEqual({});

    expect(adminUserPasswordUpdate(token, 'password1234', 'fortress9871')).toStrictEqual({});

    expect(adminUserPasswordUpdate(token, 'fortress9871', 'columbus1071')).toStrictEqual({});

    expect(adminUserPasswordUpdate(token, 'columbus1071', 'pirate981')).toStrictEqual({});

    expect(adminAuthLogin('abcd.efgh@gmail.com', 'pirate981')).toStrictEqual({
      token: expect.any(String)
    });
  });

  test('Comprehensive Test Unsuccessful: Trying to log in after trying to change to an invalid pass', () => {
    expect(() => adminUserPasswordUpdate(token, 'abcd1234', 'abcd1234')).toThrow(HTTPError[400]);

    expect(adminAuthLogin('abcd.efgh@gmail.com', 'abcd1234')).toStrictEqual({
      token: expect.any(String)
    });
  });

  test('Test Unsuccessful: Token invalid', () => {
    expect(() => adminUserPasswordUpdate('', 'abcd1234', 'efgh5678')).toThrow(HTTPError[401]);
  });

  test('Test Unsuccessful: Old Password Incorrect', () => {
    expect(() => adminUserPasswordUpdate(token, 'aecd1234', 'efgh5678')).toThrow(HTTPError[400]);
  });

  test('Test Unsuccessful: Passwords are the Same', () => {
    expect(() => adminUserPasswordUpdate(token, 'abcd1234', 'abcd1234')).toThrow(HTTPError[400]);
  });

  test('Test Unsuccessful: New Password Matches Old Password', () => {
    adminUserPasswordUpdate(token, 'abcd1234', 'efgh5678');

    expect(() => adminUserPasswordUpdate(token, 'efgh5678', 'abcd1234')).toThrow(HTTPError[400]);
  });

  test('Test Unsuccessful: Password less than 8 charachters', () => {
    expect(() => adminUserPasswordUpdate(token, 'abcd1234', 'efgh567')).toThrow(HTTPError[400]);
  });

  test('Test Unsuccessful: Password does not contain at least one number and at least one letter', () => {
    expect(() => adminUserPasswordUpdate(token, 'abcd1234', '***********')).toThrow(HTTPError[400]);
  });
});
