import {
  clear,
  adminAuthRegister,
  adminUserDetails,
  adminUserDetailsUpdate,
} from './testHelpers';

beforeEach(() => {
  clear();
});

describe('adminUserDetailsUpdate', () => {
  test('Admin updates user details successfully', () => {
    const { jsonBody: { token } } = adminAuthRegister('dilhanmert@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');
    adminUserDetailsUpdate(token, 'dilhanmert@gmail.com', 'Dun Yao', 'Foo');
    const { statusCode, jsonBody } = adminUserDetails(token);
    expect(statusCode).toStrictEqual(200);
    expect(jsonBody).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Dun Yao Foo',
        email: 'dilhanmert@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('Admin updates user details successfully with multiple users', () => {
    const { jsonBody: { token } } = adminAuthRegister('dilhanmr@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');
    adminUserDetailsUpdate(token, 'dilhanmert@gmail.com', 'Dun Yao', 'Foo');
    let response = adminUserDetails(token);
    expect(response.statusCode).toStrictEqual(200);
    expect(response.jsonBody).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Dun Yao Foo',
        email: 'dilhanmert@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });

    const token2 = adminAuthRegister('DunYao@hotmail.com', 'abCdddD123', 'DunYao', 'Foo').jsonBody;

    adminUserDetailsUpdate(token2.token, 'samueljeong@gmail.com', 'Samuel', 'Jeong');

    response = adminUserDetails(token2.token);
    expect(response.statusCode).toStrictEqual(200);
    expect(response.jsonBody).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Samuel Jeong',
        email: 'samueljeong@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });

    const token3 = adminAuthRegister('SamiHossaini@hotmail.com', 'abCdddD123', 'Sami', 'Hossain').jsonBody;
    adminUserDetailsUpdate(token3.token, 'dunyao@gmail.com', 'Dun Yao', 'Foo');
    response = adminUserDetails(token3.token);
    expect(response.statusCode).toStrictEqual(200);
    expect(response.jsonBody).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Dun Yao Foo',
        email: 'dunyao@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('Invalid email: Used by another user', () => {
    adminAuthRegister('dunyao@unsw.edu.au', 'abCdddD123', 'DunYao', 'Foo');
    const { jsonBody: { token: token2 } } = adminAuthRegister('nicksebastian@unsw.edu.au', 'abCdddD1232', 'Nick', 'Sebastian');

    const { statusCode, jsonBody } = adminUserDetailsUpdate(token2, 'dunyao@unsw.edu.au', 'Nick', 'Sebastian');
    expect(statusCode).toStrictEqual(400);
    expect(jsonBody.error).toStrictEqual(expect.any(String));
  });

  describe.each([
    ['dunyaounsw.edu.au', 'abcd1234', 'DunYao', 'Foo'],
    ['dunyao@unsw', 'abcd1234', 'DunYao', 'Foo'],
    ['dunyao@', 'abcd1234', 'DunYao', 'Foo'],
  ])('Invalid email: Incorrect input', (email, password, nameFirst, nameLast) => {
    test(`Attempt to update with invalid email ${email}`, () => {
      const { jsonBody: { token } } = adminAuthRegister('validemail@unsw.edu.au', 'abCdddD123', 'ValidName', 'ValidLast');
      const { statusCode, jsonBody } = adminUserDetailsUpdate(token, email, nameFirst, nameLast);
      expect(statusCode).toStrictEqual(400);
      expect(jsonBody.error).toStrictEqual(expect.any(String));
    });
  });

  describe.each([
    ['dunyao@unsw.edu.au', 'abcd1234', '1984', 'Foo'],
    ['dunyao@unsw.edu.au', 'abcd1234', '?+-/*)(*&^%$#@!~`:><,.={}', 'Foo'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'Dun Yao123', 'Foo'],
  ])('Invalid first name: Characters', (email, password, nameFirst, nameLast) => {
    test(`Attempt to update with invalid first name "${nameFirst}"`, () => {
      const { jsonBody: { token } } = adminAuthRegister(email, 'securePassword123!', 'ValidName', 'ValidLast');
      const { statusCode, jsonBody } = adminUserDetailsUpdate(token, email, nameFirst, nameLast);
      expect(statusCode).toStrictEqual(400);
      expect(jsonBody.error).toStrictEqual(expect.any(String));
    });
  });

  describe.each([
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '1984'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '?+-/*)(*&^%$#@!~`:><,.={}'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Dun Yao123'],
  ])('Invalid last name: Characters', (email, password, nameFirst, nameLast) => {
    test(`Attempt to update with invalid last name "${nameLast}"`, () => {
      const { jsonBody: { token } } = adminAuthRegister(email, password, nameFirst, 'ValidLast');
      const { statusCode, jsonBody } = adminUserDetailsUpdate(token, email, nameFirst, nameLast);

      expect(statusCode).toStrictEqual(400);
      expect(jsonBody.error).toStrictEqual(expect.any(String));
    });
  });
/*
  describe('Blank last name', () => {
    test('Attempt to update with a blank last name', () => {
      const { jsonBody: { token } } = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
      const { statusCode, jsonBody } = adminUserDetailsUpdate(token, 'dunyao@unsw.edu.au', 'DunYao', '');

      expect(statusCode).toStrictEqual(400);
      expect(jsonBody.error).toStrictEqual(expect.any(String));
    });
  });

    test("Attempt to update with a blank first name, given last name", () => {
      const { jsonBody: { token } } = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
      const { statusCode, jsonBody } = adminUserDetailsUpdate(token, 'dunyao@unsw.edu.au', ' ', 'Foo');

      expect(statusCode).toStrictEqual(400);
      expect(jsonBody.error).toStrictEqual(expect.any(String));
    });

    test('Attempt to update with a blank email, given names', () => {
      const { jsonBody: { token } } = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
      const { statusCode, jsonBody } = adminUserDetailsUpdate(token, '', 'DunYao', 'Foo');

      expect(jsonBody.error).toStrictEqual(expect.any(String));
      expect(statusCode).toStrictEqual(400);
    });

  describe.each([
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'a'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'abcdefghijklmnopqafssafasrstu'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'abcdefghijklmnopqfafsaasfrstuv'],
  ])('Invalid last name: Length', (email, password, nameFirst, nameLast) => {
    test(`Attempt to update with invalid last name length "${nameLast}"`, () => {
      const { jsonBody: { token } } = adminAuthRegister(email, password, nameFirst, 'ValidLast');
      const { statusCode, jsonBody } = adminUserDetailsUpdate(token, email, nameFirst, nameLast);

      expect(statusCode).toStrictEqual(400);
      expect(jsonBody.error).toStrictEqual(expect.any(String));
    });
  });
  */
});
