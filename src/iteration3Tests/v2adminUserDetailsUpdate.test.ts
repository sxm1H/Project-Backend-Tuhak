import {
  adminUserDetails,
  adminUserDetailsUpdate
} from './v2testHelpers';
import {
  clear,
  adminAuthRegister
} from '../iteration2Tests/testHelpers';
import HTTPError from 'http-errors';

let token: string;
beforeEach(() => {
  clear();
  token = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo').token;
});

describe('adminUserDetailsUpdate', () => {
  test('Admin updates user details successfully', () => {
    adminUserDetailsUpdate(token, 'dilhanmert@gmail.com', 'Dilhan', 'Mert');
    expect(adminUserDetails(token)).toStrictEqual({
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

    expect(response).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Samuel Jeong',
        email: 'bingbong@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });

    const token2 = adminAuthRegister('DunYao@hotmail.com', 'abCdddD123', 'DunYao', 'Foo').token;
    adminUserDetailsUpdate(token2, 'samueljeong@gmail.com', 'Sami', 'Hossain');
    response = adminUserDetails(token2);

    expect(response).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Sami Hossain',
        email: 'samueljeong@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });

    const token3 = adminAuthRegister('SamiHossaini@hotmail.com', 'abCdddD123', 'Sami', 'Hossain').token;
    adminUserDetailsUpdate(token3, 'dunyao@gmail.com', 'Dun Yao', 'Foo');
    response = adminUserDetails(token3);

    expect(response).toStrictEqual({
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
    const token2 = adminAuthRegister('nicksebastian@unsw.edu.au', 'abCdddD1232', 'Nick', 'Sebastian').token;

    expect(() => adminUserDetailsUpdate(token2, 'dunyao@unsw.edu.au', 'Nick', 'Sebastian')).toThrow(HTTPError[400]);
  });

  test.each([
    ['hehegmail.com', 'Nicktheless', 'sheesh'],
    ['', 'Nicktheless', 'sheesh']
  ])('Testing invalid email', (email, nameFirst, nameLast) => {
    expect(() => adminUserDetailsUpdate(token, email, nameFirst, nameLast)).toThrow(HTTPError[400]);
  });

  test.each([
    ['nick@gmail.com', '', 'sheesh'],
    ['nick@gmail.com', '109328674', 'sheesh'],
    ['nick@gmail.com', 'asdjalkdsjflaskjdgflasjdghffalksdjfalsdkjfh', 'sheesh']
  ])('Testing invalid first name', (email, nameFirst, nameLast) => {
    expect(() => adminUserDetailsUpdate(token, email, nameFirst, nameLast)).toThrow(HTTPError[400]);
  });

  test.each([
    ['nick@gmail.com', 'Nicktheless', ''],
    ['nick@gmail.com', 'Nicktheless', '10923864'],
    ['nick@gmail.com', 'Nicktheless', 'akjdshfgkasdhgfkashdgflasdhfglasdfglasdfhg']
  ])('Testing invalid last name', (email, nameFirst, nameLast) => {
    expect(() => adminUserDetailsUpdate(token, email, nameFirst, nameLast)).toThrow(HTTPError[400]);
  });

  test('Token invalid', () => {
    expect(() => adminUserDetailsUpdate(token + '1', 'bingbong@gmail.com', 'bing', 'bong')).toThrow(HTTPError[401]);
  });
});
