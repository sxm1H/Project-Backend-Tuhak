import {
  clear,
  adminAuthRegister,
  adminAuthLogin,
} from './testHelpersIter2';

beforeEach(() => {
  clear();

  adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
});

describe('adminAuthLogin', () => {
  test('Successful auth login', () => {
    adminAuthRegister('sami@gmail.com', 'sami1234', 'Sami', 'Hossein');
    adminAuthRegister('kyle1234@gmail.com', 'kyle1234', 'Kyle', 'Morley');

    const { statusCode, jsonBody } = adminAuthLogin('nick1234@gmail.com', 'nick1234');

    expect(statusCode).toStrictEqual(200);
    expect(jsonBody.token).toStrictEqual(expect.any(String));
  });

  test('Email address does not exist', () => {
    const { statusCode, jsonBody } = adminAuthLogin('DunYao@gmail.com', 'nick1234');

    expect(statusCode).toStrictEqual(400);
    expect(jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Password is not correct for the given email.', () => {
    const { statusCode, jsonBody } = adminAuthLogin('nick1234@gmail.com', 'notTheSamePassword');

    expect(statusCode).toStrictEqual(400);
    expect(jsonBody.error).toStrictEqual(expect.any(String));
  });

  test.each([
    { email: 'dunyao@unsw.edu.au', password: 'abcd1234', firstName: 'DunYao', lastName: 'Foo' },
    { email: 'nick1234@gmail.com', password: 'nick1234', firstName: 'Nicholas', lastName: 'Sebastian' },
    { email: 'Sami1234@gmail.com', password: 'Sami1234', firstName: 'Sami', lastName: 'Hossain' },
    { email: 'Samuel1234@gmail.com', password: 'Samuel1234', firstName: 'Samuel', lastName: 'Jeong' },
    { email: 'Dilhan1234@gmail.com', password: 'Dilhan1234', firstName: 'Dilhan', lastName: 'Mert' }
  ])('Comprehensive successful tests - testing multiple users IDs are returned correctly', ({ email, password, firstName, lastName }) => {
    adminAuthRegister(email, password, firstName, lastName);

    const { statusCode, jsonBody } = adminAuthLogin(email, password);

    // Customized test message for each user
    expect(statusCode).toStrictEqual(200);
    expect(jsonBody.token).toStrictEqual(expect.any(String));
  });
});
