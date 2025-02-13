import {
  clear,
  adminAuthRegister,
} from './testHelpers';
import HTTPError from 'http-errors';

beforeEach(() => {
  clear();
});

describe('Testing POST /v1/admin/auth/register', () => {
  test('Successful registration: Return values', () => {
    expect(adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo')).toStrictEqual({
      token: expect.any(String)
    });
  });

  test('Invalid email: Used by another user', () => {
    adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');

    expect(() => adminAuthRegister('dunyao@unsw.edu.au', '1234abcd', 'Nick', 'Sebastian')).toThrow(HTTPError[400]);
  });

  test.each([
    ['dunyaounsw.edu.au', 'abcd1234', 'DunYao', 'Foo'],
    ['dunyao@unsw', 'abcd1234', 'DunYao', 'Foo'],
    ['dunyao@', 'abcd1234', 'DunYao', 'Foo'],
  ])('Invalid email: Incorrect input', (email, password, nameFirst, nameLast) => {
    expect(() => adminAuthRegister(email, password, nameFirst, nameLast)).toThrow(HTTPError[400]);
  });

  test.each([
    ['dunyao@unsw.edu.au', 'abcd1234', '1984', 'Foo'],
    ['dunyao@unsw.edu.au', 'abcd1234', '?+-/*)(*&^%$#@!~`:><,.={}', 'Foo'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'Dun Yao123', 'Foo'],
  ])('Invalid first name: Characters', (email, password, nameFirst, nameLast) => {
    expect(() => adminAuthRegister(email, password, nameFirst, nameLast)).toThrow(HTTPError[400]);
  });

  test.each([
    ['dunyao@unsw.edu.au', 'abcd1234', 'o', 'Foo'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'abcdefghijklmnopqrstu', 'Foo'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'abcdefghijklmnopqrstuv', 'Foo'],
  ])('Invalid first name: Length', (email, password, nameFirst, nameLast) => {
    expect(() => adminAuthRegister(email, password, nameFirst, nameLast)).toThrow(HTTPError[400]);
  });

  test.each([
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '1984'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '?+-/*)(*&^%$#@!~`:><,.={}'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Dun Yao123'],
  ])('Invalid last name: Characters', (email, password, nameFirst, nameLast) => {
    expect(() => adminAuthRegister(email, password, nameFirst, nameLast)).toThrow(HTTPError[400]);
  });

  test.each([
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'a'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'abcdefghijklmnopqrstu'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'abcdefghijklmnopqrstuv'],
  ])('Invalid last name: Length', (email, password, nameFirst, nameLast) => {
    expect(() => adminAuthRegister(email, password, nameFirst, nameLast)).toThrow(HTTPError[400]);
  });

  test.each([
    ['dunyao@unsw.edu.au', '', 'DunYao', 'Foo'],
    ['dunyao@unsw.edu.au', 'a1', 'DunYao', 'Foo'],
    ['dunyao@unsw.edu.au', 'abcd123', 'DunYao', 'Foo'],
  ])('Invalid password: Length', (email, password, nameFirst, nameLast) => {
    expect(() => adminAuthRegister(email, password, nameFirst, nameLast)).toThrow(HTTPError[400]);
  });

  test.each([
    ['dunyao@unsw.edu.au', '12345678', 'DunYao', 'Foo'],
    ['dunyao@unsw.edu.au', 'abcdefgh', 'DunYao', 'Foo'],
    ['dunyao@unsw.edu.au', 'ABCDEFGH', 'DunYao', 'Foo'],
  ])('Invalid password: Characters', (email, password, nameFirst, nameLast) => {
    expect(() => adminAuthRegister(email, password, nameFirst, nameLast)).toThrow(HTTPError[400]);
  });
});
