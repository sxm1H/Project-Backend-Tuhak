import {
  clear,
  adminAuthRegister,
  adminAuthLogin,
} from './testHelpersIter2';
import HTTPError from 'http-errors';

beforeEach(() => {
  clear();

  adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
});

describe('adminAuthLogin', () => {
  test('Successful auth login', () => {
    adminAuthRegister('sami@gmail.com', 'sami1234', 'Sami', 'Hossein');
    adminAuthRegister('kyle1234@gmail.com', 'kyle1234', 'Kyle', 'Morley');

    expect(adminAuthLogin('nick1234@gmail.com', 'nick1234')).toStrictEqual({
      token: expect.any(String)
    });
  });

  test('Email address does not exist', () => {
    expect(() => adminAuthLogin('DunYao@gmail.com', 'nick1234')).toThrow(HTTPError[400]);
  });

  test('Password is not correct for the given email.', () => {
    expect(() => adminAuthLogin('nick1234@gmail.com', 'notTheSamePassword')).toThrow(HTTPError[400]);
  });

  test.each([
    { email: 'dunyao@unsw.edu.au', password: 'abcd1234', firstName: 'DunYao', lastName: 'Foo' },
    { email: 'Sami1234@gmail.com', password: 'Sami1234', firstName: 'Sami', lastName: 'Hossain' },
    { email: 'Samuel1234@gmail.com', password: 'Samuel1234', firstName: 'Samuel', lastName: 'Jeong' },
    { email: 'Dilhan1234@gmail.com', password: 'Dilhan1234', firstName: 'Dilhan', lastName: 'Mert' }
  ])('Comprehensive successful tests - testing multiple users IDs are returned correctly', ({ email, password, firstName, lastName }) => {
    expect(adminAuthRegister(email, password, firstName, lastName)).toStrictEqual({
      token: expect.any(String)
    })
  });
});

test('temp', () => {
  expect(2 + 2).toBe(4);
});
