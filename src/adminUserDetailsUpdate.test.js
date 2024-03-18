import { clear } from './other';
import {
  adminAuthLogin, 
  adminAuthRegister,
  adminUserDetails,
  adminUserDetailsUpdate,
  adminUserPasswordUpdate
} from './auth';
import {
  requestHelper,
  clear,
  adminAuthRegister,
  adminAuthLogin,
  adminUserDetails,
  adminUserDetailsUpdate,
  adminUserPasswordUpdate,
  adminQuizList,
  adminQuizCreate,
  adminQuizRemove,
  adminQuizInfo,
  adminQuizNameUpdate,
  adminQuizDescriptionUpdate
} from './testHelpers';

beforeEach(() => {
  clear();
});

describe('adminUserDetailsUpdate', () => {
  
  test('Admin updates user details successfully', () => {
    let admin = adminAuthRegister('dilhanmr@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');
    let update = adminUserDetailsUpdate(admin.authUserId, 'dilhanmert@gmail.com','Dun Yao','Foo')

    expect(update).toStrictEqual({});
    expect(adminUserDetails(admin.authUserId)).toStrictEqual({
      user: {
        userId: admin.authUserId,
        name: 'Dun Yao Foo',
        email: 'dilhanmert@gmail.com',
        numSuccessfulLogins: expect.any(Number),
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('Admin updates user details successfully with multiple users', () => {
    let admin = adminAuthRegister('dilhanmr@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');
    let admin2 = adminAuthRegister('DunYao@hotmail.com', 'abCdddD123', 'DunYao', 'Foo');
    let admin3 = adminAuthRegister('SamiHossaini@hotmail.com', 'abCdddD123', 'Samuel', 'Jeong');

    let update = adminUserDetailsUpdate(admin.authUserId, 'dilhanmert@gmail.com','Dun Yao','Foo');
    let update2 = adminUserDetailsUpdate(admin2.authUserId, 'dunyao@gmail.com','Dun','Foo');
    let update3 = adminUserDetailsUpdate(admin3.authUserId, 'Sami@hotmail.com','Samuel','Jeong');

    expect(update).toStrictEqual({});
    expect(update2).toStrictEqual({});
    expect(update3).toStrictEqual({});
    expect(adminUserDetails(admin.authUserId)).toStrictEqual({
      user: {
        userId: admin.authUserId,
        name: 'Dun Yao Foo',
        email: 'dilhanmert@gmail.com',
        numSuccessfulLogins: expect.any(Number),
        numFailedPasswordsSinceLastLogin: 0,
      }
    });

    expect(adminUserDetails(admin2.authUserId)).toStrictEqual({
      user: {
        userId: admin2.authUserId,
        name: 'Dun Foo',
        email: 'dunyao@gmail.com',
        numSuccessfulLogins: expect.any(Number),
        numFailedPasswordsSinceLastLogin: 0,
      }
    });

    expect(adminUserDetails(admin3.authUserId)).toStrictEqual({
      user: {
        userId: admin3.authUserId,
        name: 'Samuel Jeong',
        email: 'Sami@hotmail.com',
        numSuccessfulLogins: expect.any(Number),
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('Invalid email: Used by another user', () => {
    let user1 = adminAuthRegister('dunyao@unsw.edu.au', 'abCdddD123', 'DunYao', 'Foo');
    user1 = adminUserDetailsUpdate('dunyao@unsw.edu.au', 'abCdddD1232', 'Nick', 'Sebastian');
    
    expect(user1.error).toStrictEqual(expect.any(String));
  });

  test.each([
    ['dunyaounsw.edu.au', 'abcd1234', 'DunYao', 'Foo'],
    ['dunyao@unsw', 'abcd1234', 'DunYao', 'Foo'],
    ['dunyao@', 'abcd1234', 'DunYao', 'Foo'],
  ]) ('Invalid email: Incorrect input', (email, password, nameFirst, nameLast) => {
    let user1 = adminAuthRegister('dunyao@unsw.edu.au', 'abCdddD123', 'DunYao', 'Foo');
    user1 = adminUserDetailsUpdate(email, password, nameFirst, nameLast);
    
    expect(user1.error).toStrictEqual(expect.any(String));
  });

  test.each([
    ['dunyao@unsw.edu.au', 'abcd1234', '1984', 'Foo'],
    ['dunyao@unsw.edu.au', 'abcd1234', '?+-/*)(*&^%$#@!~`:><,.={}\|', 'Foo'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'Dun Yao123', 'Foo'],
  ]) ('Invalid first name: Characters', (email, password, nameFirst, nameLast) => {
    let user1 = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
    user1 = adminUserDetailsUpdate(email, password, nameFirst, nameLast);
    
    expect(user1.error).toStrictEqual(expect.any(String));
  });

  test.each([
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '1984'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '?+-/*)(*&^%$#@!~`:><,.={}\|'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Dun Yao123'],
  ]) ('Invalid last name: Characters', (email, password, nameFirst, nameLast) => {
    let user1 = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
    user1 = adminUserDetailsUpdate(email, password, nameFirst, nameLast);

    expect(user1.error).toStrictEqual(expect.any(String));
  });

  test.each([
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '1984'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '?+-/*)(*&^%$#@!~`:><,.={}\|'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Dun Yao123'],
  ]) ('blank last name', (email, password, nameFirst, nameLast) => {
    let user1 = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
    user1 = adminUserDetailsUpdate(email, password, nameFirst, );
    
    expect(user1.error).toStrictEqual(expect.any(String));
  });

  test.each([
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '1984'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '?+-/*)(*&^%$#@!~`:><,.={}\|'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Dun Yao123'],
  ]) ('blank first name', (email, password, nameFirst, nameLast) => {
    let user1 = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
    user1 = adminUserDetailsUpdate(email, password, ' ', nameLast);

    expect(user1.error).toStrictEqual(expect.any(String));
  });

  test.each([
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '1984'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '?+-/*)(*&^%$#@!~`:><,.={}\|'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Dun Yao123'],
  ]) ('blank password', (email, password, nameFirst, nameLast) => {
    let user1 = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
    user1 = adminUserDetailsUpdate(email, '', nameFirst, nameLast);

    expect(user1.error).toStrictEqual(expect.any(String));
  });

  test.each([
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '1984'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '?+-/*)(*&^%$#@!~`:><,.={}\|'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Dun Yao123'],
  ]) ('blank email', (email, password, nameFirst, nameLast) => {
    let user1 = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
    user1 = adminUserDetailsUpdate('', password, nameFirst, nameLast);
    
    expect(user1.error).toStrictEqual(expect.any(String));
  });

  test.each([
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'a'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'abcdefghijklmnopqrstu'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'abcdefghijklmnopqrstuv'],
  ]) ('Invalid last name: Length', (email, password, nameFirst, nameLast) => {
    let user1 = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
    user1 = adminUserDetailsUpdate(email, password, nameFirst, nameLast);

    expect(user1.error).toStrictEqual(expect.any(String));
  });
})