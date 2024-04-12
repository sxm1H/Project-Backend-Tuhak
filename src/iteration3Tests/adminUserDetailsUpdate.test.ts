import {
  clear,
  adminAuthRegister,
  adminUserDetails,
  adminUserDetailsUpdate,
} from './testHelpersIter3';

let token: string;
beforeEach(() => {
  clear();
  const { jsonBody } = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');

  token = jsonBody.token;
});

describe('adminUserDetailsUpdate', () => {
  test('Admin updates user details successfully', () => {
    adminUserDetailsUpdate(token, 'dilhanmert@gmail.com', 'Dilhan', 'Mert');
    const { statusCode, jsonBody } = adminUserDetails(token);
    expect(statusCode).toStrictEqual(200);
    expect(jsonBody).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Dilhan Mert',
        email: 'dilhanmert@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('Admin updates user details successfully with multiple users', () => {
    adminUserDetailsUpdate(token, 'bingbong@gmail.com', 'Samuel', 'Jeong');
    let response = adminUserDetails(token);

    expect(response.statusCode).toStrictEqual(200);
    expect(response.jsonBody).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Samuel Jeong',
        email: 'bingbong@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });

    const token2 = adminAuthRegister('DunYao@hotmail.com', 'abCdddD123', 'DunYao', 'Foo').jsonBody;
    adminUserDetailsUpdate(token2.token, 'samueljeong@gmail.com', 'Sami', 'Hossain');
    response = adminUserDetails(token2.token);

    expect(response.statusCode).toStrictEqual(200);
    expect(response.jsonBody).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Sami Hossain',
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
    const { jsonBody: { token: token2 } } = adminAuthRegister('nicksebastian@unsw.edu.au', 'abCdddD1232', 'Nick', 'Sebastian');

    const { statusCode, jsonBody } = adminUserDetailsUpdate(token2, 'dunyao@unsw.edu.au', 'Nick', 'Sebastian');
    expect(statusCode).toStrictEqual(400);
    expect(jsonBody.error).toStrictEqual(expect.any(String));
  });

  test.each([
    ['hehegmail.com', 'Nicktheless', 'sheesh'],
    ['', 'Nicktheless', 'sheesh']
  ])('Testing invalid email', (email, nameFirst, nameLast) => {
    const { statusCode, jsonBody } = adminUserDetailsUpdate(token, email, nameFirst, nameLast);

    expect(statusCode).toStrictEqual(400);
    expect(jsonBody.error).toStrictEqual(expect.any(String));
  });

  test.each([
    ['nick@gmail.com', '', 'sheesh'],
    ['nick@gmail.com', '109328674', 'sheesh'],
    ['nick@gmail.com', 'asdjalkdsjflaskjdgflasjdghffalksdjfalsdkjfh', 'sheesh']
  ])('Testing invalid first name', (email, nameFirst, nameLast) => {
    const { statusCode, jsonBody } = adminUserDetailsUpdate(token, email, nameFirst, nameLast);

    expect(statusCode).toStrictEqual(400);
    expect(jsonBody.error).toStrictEqual(expect.any(String));
  });

  test.each([
    ['nick@gmail.com', 'Nicktheless', ''],
    ['nick@gmail.com', 'Nicktheless', '10923864'],
    ['nick@gmail.com', 'Nicktheless', 'akjdshfgkasdhgfkashdgflasdhfglasdfglasdfhg']
  ])('Testing invalid last name', (email, nameFirst, nameLast) => {
    const { statusCode, jsonBody } = adminUserDetailsUpdate(token, email, nameFirst, nameLast);

    expect(statusCode).toStrictEqual(400);
    expect(jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Token invalid', () => {
    const { statusCode, jsonBody } = adminUserDetailsUpdate(token + '1', 'bingbong@gmail.com', 'bing', 'bong');

    expect(statusCode).toStrictEqual(401);
    expect(jsonBody.error).toStrictEqual(expect.any(String));
  });
});
