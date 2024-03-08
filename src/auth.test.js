
import { clear } from './other.js';
import {
  adminAuthLogin, 
  adminAuthRegister,
  adminUserDetails,
  adminUserDetailsUpdate,
  adminUserPasswordUpdate,
} from './auth.js';

beforeEach(() => {
  clear();
});

describe('adminAuthLogin', () => {
  test('Successful auth login', () => {
    let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');

    adminAuthRegister('sami@gmail.com', 'sami1234', 'Sami', 'Hossein');
    adminAuthRegister('kyle1234@gmail.com', 'kyle1234', 'Kyle', 'Morley');

    let userLog = adminAuthLogin('nick1234@gmail.com', 'nick1234');

    expect(userReg.authUserId).toBe(userLog.authUserId);
  });

  test('Email address does not exist', () => {
    let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    let error = adminAuthLogin('DunYao@gmail.com', 'nick1234');

    expect(error.error).toEqual(expect.any(String));
  });
    
  test('Password is not correct for the given email.', () => {

    let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    let error = adminAuthLogin('nick1234@gmail.com', 'notTheSamePassword');

    expect(error.error).toEqual(expect.any(String));
  });

  test('Password is not correct for the given email.', () => {

    let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    let error = adminAuthLogin('nick1234@gmail.com', 'notTheSamePassword');

    expect(error.error).toEqual(expect.any(String));
  });




});


describe('adminAuthRegister', () => {

  test('Successful registration: Return value', () => {
    let user = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
    expect(user.authUserId).toStrictEqual(expect.any(Number));
  });

  test('Successful registration: adminAuthLogin', () => {
    let user = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
    let userlog = adminAuthLogin('dunyao@unsw.edu.au', 'abcd1234');
    expect(userlog.authUserId).toStrictEqual(expect.any(Number));
  });
  
  test('Invalid email: Used by another user', () => {
    let user1 = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
    let user2 = adminAuthRegister('dunyao@unsw.edu.au', '1234abcd', 'Nick', 'Sebastian');
    expect(user2.error).toStrictEqual(expect.any(String));
  });

  test.each([
    ['dunyaounsw.edu.au', 'abcd1234', 'DunYao', 'Foo'],
    ['dunyao@unsw', 'abcd1234', 'DunYao', 'Foo'],
    ['dunyao@', 'abcd1234', 'DunYao', 'Foo'],
  ]) ('Invalid email: Incorrect input', (email, password, nameFirst, nameLast) => {
    let user = adminAuthRegister(email, password, nameFirst, nameLast);
    expect(user.error).toStrictEqual(expect.any(String));
  })
  
  test.each([
    ['dunyao@unsw.edu.au', 'abcd1234', '1984', 'Foo'],
    ['dunyao@unsw.edu.au', 'abcd1234', '?+-/*)(*&^%$#@!~`:><,.={}\|', 'Foo'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'Dun Yao123', 'Foo'],
  ]) ('Invalid first name: Characters', (email, password, nameFirst, nameLast) => {
    let user = adminAuthRegister(email, password, nameFirst, nameLast);
    expect(user.error).toStrictEqual(expect.any(String));
  });
  
  test.each([
    ['dunyao@unsw.edu.au', 'abcd1234', 'o', 'Foo'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'abcdefghijklmnopqrstu', 'Foo'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'abcdefghijklmnopqrstuv', 'Foo'],
  ]) ('Invalid first name: Length', (email, password, nameFirst, nameLast) => {
    let user = adminAuthRegister(email, password, nameFirst, nameLast);
    expect(user.error).toStrictEqual(expect.any(String));
  });
  
  test.each([
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '1984'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '?+-/*)(*&^%$#@!~`:><,.={}\|'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Dun Yao123'],
  ]) ('Invalid last name: Characters', (email, password, nameFirst, nameLast) => {
    let user = adminAuthRegister(email, password, nameFirst, nameLast);
    expect(user.error).toStrictEqual(expect.any(String));
  });

  test.each([
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'a'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'abcdefghijklmnopqrstu'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'abcdefghijklmnopqrstuv'],
  ]) ('Invalid last name: Length', (email, password, nameFirst, nameLast) => {
    let user = adminAuthRegister(email, password, nameFirst, nameLast);
    expect(user.error).toStrictEqual(expect.any(String));
  });
  
  test.each([
    ['dunyao@unsw.edu.au', '', 'DunYao', 'Foo'],
    ['dunyao@unsw.edu.au', 'a', 'DunYao', 'Foo'],
    ['dunyao@unsw.edu.au', 'a1', 'DunYao', 'Foo'],
    ['dunyao@unsw.edu.au', 'ab1', 'DunYao', 'Foo'],
    ['dunyao@unsw.edu.au', 'ab12', 'DunYao', 'Foo'],
    ['dunyao@unsw.edu.au', 'abc12', 'DunYao', 'Foo'],
    ['dunyao@unsw.edu.au', 'abc123', 'DunYao', 'Foo'],
    ['dunyao@unsw.edu.au', 'abcd123', 'DunYao', 'Foo'],
  ]) ('Invalid password: Length', (email, password, nameFirst, nameLast) => {
    let user = adminAuthRegister(email, password, nameFirst, nameLast);
    expect(user.error).toStrictEqual(expect.any(String));
  });

  test.each([
    ['dunyao@unsw.edu.au', '12345678', 'DunYao', 'Foo'],
    ['dunyao@unsw.edu.au', 'abcdefgh', 'DunYao', 'Foo'],
    ['dunyao@unsw.edu.au', 'ABCDEFGH', 'DunYao', 'Foo'],
  ]) ('Invalid password: Characters', (email, password, nameFirst, nameLast) => {
    let user = adminAuthRegister(email, password, nameFirst, nameLast);
    expect(user.error).toStrictEqual(expect.any(String));
  });
  
});

describe('adminUserDetails', () => {
  test('correct return type', () => {
    let admin = adminAuthRegister('Dilhanm@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');
    expect(adminUserDetails(admin.authUserId)).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        numSuccessfulLogins: expect.any(Number),
        numFailedPasswordsSinceLastLogin: expect.any(Number),
      }
    });
  });
  describe('adminUserDetails', () => {
    test('correct return type when userid is wrong', () => {
      let admin = adminAuthRegister('Dilhanm@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');
      expect(adminUserDetails(admin.authUserId + 1)).toStrictEqual({'error': 'authUserId not a valid Id'});
    });});
  describe('adminUserDetails', () => {
    test('correct return type when userid is wrong', () => {
      let admin = adminAuthRegister('Dilhanm@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');
      expect(adminUserDetails(admin.authUserId - 2)).toStrictEqual({'error': 'authUserId not a valid Id'});
    });});

  test('name and email functionality', () => {
    let admin = adminAuthRegister('dilhanmr@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');
    let admin2 = adminAuthRegister('DunYao@hotmail.com', 'abCdddD123', 'DunYao', 'Foo');
    expect(adminUserDetails(admin2.authUserId)).toStrictEqual(
      {
        user: {
          userId: expect.any(Number),
          name: expect.any(String),
          email: expect.any(String),
          numSuccessfulLogins: expect.any(Number),
          numFailedPasswordsSinceLastLogin: expect.any(Number),
        }
      }
    );
  });
  test('correct numSuccessfulLogins', () => {
    let admin = adminAuthRegister('dilhanm@gmail.com', 'abCddddD123', 'Dilhan', 'Mert');
    for (let i = 0; i < 4; i++) {
      adminAuthLogin('dilhanm@gmail.com', 'abCddddD123');
    }
    expect(adminUserDetails(admin.authUserId)).toStrictEqual(
      {
        user: {
          userId: expect.any(Number),
          name: expect.any(String),
          email: expect.any(String),
          numSuccessfulLogins: 5,
          numFailedPasswordsSinceLastLogin: expect.any(Number),
        }
      }
    );
  });
  test('correct numFailedPasswordsSinceLastLogin', () => {
    let admin = adminAuthRegister('dilhanmr@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');
    for (let i = 0; i < 3; i++) {
      adminAuthLogin('dilhanmr@gmail.com', 'abCddddD1232');
    }
    expect(adminUserDetails(admin.authUserId)).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        numSuccessfulLogins: expect.any(Number),
        numFailedPasswordsSinceLastLogin: 3,
      }
    });
    adminAuthLogin('dilhanmr@gmail.com', 'abCdddD123');
    expect(adminUserDetails(admin.authUserId)).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        numSuccessfulLogins: expect.any(Number),
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });
});
test('Admin updates user details successfully', () => {
  let admin = adminAuthRegister('dilhanmr@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');
  expect(adminUserDetailsUpdate(admin.authUserId, 'dilhanmert@gmail.com','Dun Yao','Foo')).toEqual({});

 
  expect(adminUserDetails(admin.authUserId)).toEqual({
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
  expect(adminUserDetailsUpdate(admin.authUserId, 'dilhanmert@gmail.com','Dun Yao','Foo')).toEqual({});
  expect(adminUserDetailsUpdate(admin2.authUserId, 'dilhanzekeriyya@gmail.com','Nicholas','Sebastian')).toEqual({});
  expect(adminUserDetailsUpdate(admin3.authUserId, 'SamiHossaini@hotmail.com','Samuel','Jeong')).toEqual({});
  expect(adminUserDetails(admin.authUserId)).toEqual({
    user: {
      userId: admin.authUserId,
      name: 'Dun Yao Foo',
      email: 'dilhanmert@gmail.com',
      numSuccessfulLogins: expect.any(Number),
      numFailedPasswordsSinceLastLogin: 0,
    }
  });
  expect(adminUserDetails(admin2.authUserId)).toEqual({
    user: {
      userId: admin2.authUserId,
      name: 'Nicholas Sebastian',
      email: 'dilhanzekeriyya@gmail.com',
      numSuccessfulLogins: expect.any(Number),
      numFailedPasswordsSinceLastLogin: 0,
    }
  });
  expect(adminUserDetails(admin3.authUserId)).toEqual({
    user: {
      userId: admin3.authUserId,
      name: 'Samuel Jeong',
      email: 'SamiHossaini@hotmail.com',
      numSuccessfulLogins: expect.any(Number),
      numFailedPasswordsSinceLastLogin: 0,
    }
  });
});
test('Admin fails to update multiple users', () => {
  let admin = adminAuthRegister('dilhanmr@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');
  let admin2 = adminAuthRegister('DunYao@hotmail.com', 'abCdddD123', 'Dun Yao', 'Foo');
  let admin3 = adminAuthRegister('SamiHossain@hotmail.com', 'abCdddD123', 'Samuel', 'Jeong');
  expect(adminUserDetailsUpdate(admin.authUserId, 'dilhanmert@gmail','Dun Yao','Foo')).toEqual({error: 'Invalid email.'});
  expect(adminUserDetailsUpdate(admin2.authUserId, 'dilhanzekeriyya@.com','Nicholas','Sebastian')).toEqual({error: 'Invalid email.'});
  expect(adminUserDetailsUpdate(admin3.authUserId, 'SamiHossain@.com','Samuel','Jeong')).toEqual({error: 'Invalid email.'});
  expect(adminUserDetails(admin.authUserId)).toEqual({
    user: {
      userId: admin.authUserId,
      name: 'Dilhan Mert',
      email: 'dilhanmr@gmail.com',
      numSuccessfulLogins: expect.any(Number),
      numFailedPasswordsSinceLastLogin: 0,
    }
  });
  expect(adminUserDetails(admin2.authUserId)).toEqual({
    user: {
      userId: admin2.authUserId,
      name: 'Dun Yao Foo',
      email: 'DunYao@hotmail.com',
      numSuccessfulLogins: expect.any(Number),
      numFailedPasswordsSinceLastLogin: 0,
    }
  });
  expect(adminUserDetails(admin3.authUserId)).toEqual({
    user: {
      userId: admin3.authUserId,
      name: 'Samuel Jeong',
      email: 'SamiHossain@hotmail.com',
      numSuccessfulLogins: expect.any(Number),
      numFailedPasswordsSinceLastLogin: 0,
    }
  });
});
test('Admin fails to update multiple users then logs in', () => {
  let admin = adminAuthRegister('dilhanmr@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');
  let admin2 = adminAuthRegister('DunYao@hotmail.com', 'abCdddD123', 'Dun Yao', 'Foo');
  let admin3 = adminAuthRegister('SamiHossain@hotmail.com', 'abCdddD123', 'Samuel', 'Jeong');
  expect(adminUserDetailsUpdate(admin.authUserId, 'dilhanmert@gmail','Dun Yao','Foo')).toEqual({error: 'Invalid email.'});
  expect(adminUserDetailsUpdate(admin2.authUserId, 'dilhanzekeriyya@.com','Nicholas','Sebastian')).toEqual({error: 'Invalid email.'});
  expect(adminUserDetailsUpdate(admin3.authUserId, 'SamiHossain@.com','Samuel','Jeong')).toEqual({error: 'Invalid email.'});
  expect(adminAuthLogin('dilhanmr@gmail.com','abCdddD123')).toEqual( {'authUserId': admin.authUserId});
  expect(adminUserDetails(admin.authUserId)).toEqual({
    user: {
      userId: admin.authUserId,
      name: 'Dilhan Mert',
      email: 'dilhanmr@gmail.com',
      numSuccessfulLogins: 2,
      numFailedPasswordsSinceLastLogin: 0,
    }
  });
  expect(adminAuthLogin('DunYao@hotmail.com','abCdddD123')).toEqual( {'authUserId': admin2.authUserId});
  expect(adminUserDetails(admin2.authUserId)).toEqual({
    user: {
      userId: admin2.authUserId,
      name: 'Dun Yao Foo',
      email: 'DunYao@hotmail.com',
      numSuccessfulLogins: 2,
      numFailedPasswordsSinceLastLogin: 0,
    }
  });
  expect(adminUserDetails(admin3.authUserId)).toEqual({
    user: {
      userId: admin3.authUserId,
      name: 'Samuel Jeong',
      email: 'SamiHossain@hotmail.com',
      numSuccessfulLogins: expect.any(Number),
      numFailedPasswordsSinceLastLogin: 0,
    }
  });
  

});
test('Admin fails to update multiple users then unsuccesfully tries to log in', () => {
  let admin = adminAuthRegister('dilhanmr@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');
  let admin2 = adminAuthRegister('DunYao@hotmail.com', 'abCdddD123', 'Dun Yao', 'Foo');
  let admin3 = adminAuthRegister('SamiHossain@hotmail.com', 'abCdddD123', 'Samuel', 'Jeong');
  expect(adminUserDetailsUpdate(admin.authUserId, 'dilhanmert@gmail','Dun Yao','Foo')).toEqual({error: 'Invalid email.'});
  expect(adminUserDetailsUpdate(admin2.authUserId, 'dilhanzekeriyya@.com','Nicholas','Sebastian')).toEqual({error: 'Invalid email.'});
  expect(adminUserDetailsUpdate(admin3.authUserId, 'SamiHossain@.com','Samuel','Jeong')).toEqual({error: 'Invalid email.'});
  expect(adminAuthLogin('dilhanmr@gmail.com','abCdddD12322')).toEqual( {error: 'Password is not correct for the given email.'});
  expect(adminUserDetails(admin.authUserId)).toEqual({
    user: {
      userId: admin.authUserId,
      name: 'Dilhan Mert',
      email: 'dilhanmr@gmail.com',
      numSuccessfulLogins: 1,
      numFailedPasswordsSinceLastLogin: 1,
    }
  });
  expect(adminAuthLogin('DunYao@hotmail.com','abCdddD12322')).toEqual( {error: 'Password is not correct for the given email.'});
  expect(adminUserDetails(admin2.authUserId)).toEqual({
    user: {
      userId: admin2.authUserId,
      name: 'Dun Yao Foo',
      email: 'DunYao@hotmail.com',
      numSuccessfulLogins: 1,
      numFailedPasswordsSinceLastLogin: 1,
    }
  });
  expect(adminUserDetails(admin3.authUserId)).toEqual({
    user: {
      userId: admin3.authUserId,
      name: 'Samuel Jeong',
      email: 'SamiHossain@hotmail.com',
      numSuccessfulLogins: expect.any(Number),
      numFailedPasswordsSinceLastLogin: 0,
    }
  });
  

});
test('Admin fails to update multiple users then unsuccesfully tries to log in and then a demonstration fo succesfully changing password and logging in', () => {
  let admin = adminAuthRegister('dilhanmr@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');
  let admin2 = adminAuthRegister('DunYao@hotmail.com', 'abCdddD123', 'Dun Yao', 'Foo');
  let admin3 = adminAuthRegister('SamiHossain@hotmail.com', 'abCdddD123', 'Samuel', 'Jeong');
  expect(adminUserDetailsUpdate(admin.authUserId, 'dilhanmert@gmail','Dun Yao','Foo')).toEqual({error: 'Invalid email.'});
  expect(adminUserDetailsUpdate(admin2.authUserId, 'dilhanzekeriyya@.com','Nicholas','Sebastian')).toEqual({error: 'Invalid email.'});
  expect(adminUserDetailsUpdate(admin3.authUserId, 'SamiHossain@.com','Samuel','Jeong')).toEqual({error: 'Invalid email.'});
  expect(adminAuthLogin('dilhanmr@gmail.com','abCdddD12322')).toEqual( {error: 'Password is not correct for the given email.'});
  expect(adminUserDetails(admin.authUserId)).toEqual({
    user: {
      userId: admin.authUserId,
      name: 'Dilhan Mert',
      email: 'dilhanmr@gmail.com',
      numSuccessfulLogins: 1,
      numFailedPasswordsSinceLastLogin: 1,
    }
  });
  expect(adminAuthLogin('DunYao@hotmail.com','abCdddD12322')).toEqual( {error: 'Password is not correct for the given email.'});
  expect(adminAuthLogin('DunYao@hotmail.com','abCdddD12322')).toEqual( {error: 'Password is not correct for the given email.'});
  expect(adminAuthLogin('DunYao@hotmail.com','abCdddD12322')).toEqual( {error: 'Password is not correct for the given email.'});
  expect(adminAuthLogin('DunYao@hotmail.com','abCdddD12322')).toEqual( {error: 'Password is not correct for the given email.'});
  expect(adminAuthLogin('DunYao@hotmail.com','abCdddD12322')).toEqual( {error: 'Password is not correct for the given email.'});
  expect(adminUserDetails(admin2.authUserId)).toEqual({
    user: {
      userId: admin2.authUserId,
      name: 'Dun Yao Foo',
      email: 'DunYao@hotmail.com',
      numSuccessfulLogins: 1,
      numFailedPasswordsSinceLastLogin: 5,
    }
  });
  expect(adminUserPasswordUpdate(admin3.authUserId, 'abCdddD123','abCdddD12322')).toEqual({});
  expect(adminAuthLogin('SamiHossain@hotmail.com','abCdddD12322')).toEqual( {'authUserId': admin3.authUserId});
  expect(adminUserDetails(admin3.authUserId)).toEqual({
    user: {
      userId: admin3.authUserId,
      name: 'Samuel Jeong',
      email: 'SamiHossain@hotmail.com',
      numSuccessfulLogins: 2,
      numFailedPasswordsSinceLastLogin: 0,
    }
  });
  

});

test('Test Successful Password Update', () => {
  clear();
  let adminId = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
  let passwordChange = adminUserPasswordUpdate(adminId.authUserId, 'abcd1234', 'efgh5678');
  expect(passwordChange).toStrictEqual({});
});

test('Test Successful: Changing Passwords a bunch of times and checking if it works', () => {
  clear();
  let adminId = adminAuthRegister('abcd.efgh@gmaik.com', 'abcd1234', 'abcd', 'efgh');
  let passwordChange = adminUserPasswordUpdate(adminId.authUserId, 'abcd1234', 'efgh5678');
  expect(passwordChange).toStrictEqual({});
  passwordChange = adminUserPasswordUpdate(adminId.authUserId, 'efgh5678', 'password1234');
  expect(passwordChange).toStrictEqual({});
  passwordChange = adminUserPasswordUpdate(adminId.authUserId, 'password1234', 'fortress9871');
  expect(passwordChange).toStrictEqual({});
  passwordChange = adminUserPasswordUpdate(adminId.authUserId, 'fortress9871', 'columbus1071');
  expect(passwordChange).toStrictEqual({});
  passwordChange = adminUserPasswordUpdate(adminId.authUserId, 'columbus1071', 'pirate981');
  expect(passwordChange).toStrictEqual({});
});
  
test('Admin fails to update succesfully', () => {
  let admin = adminAuthRegister('dilhanmr@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');
  expect(adminUserDetailsUpdate(admin.authUserId + 1, 'dilhanmert@gmail.com','Dun Yao','Foo')).toEqual({'error': 'User not found.'});
});
test('Admin updates user details with invalid email format', () => {
  let admin = adminAuthRegister('admin@example.com', 'abCdddD123', 'John', 'Doe');

  const result = adminUserDetailsUpdate(admin.authUserId, 'invalidemail', 'NewName', 'NewLastName');

 
  expect(result).toEqual({
    error: 'Invalid email.'
  });
});
test('Invalid email: Used by another user', () => {
  let user1 = adminAuthRegister('dunyao@unsw.edu.au', 'abCdddD123', 'DunYao', 'Foo');
  user1 = adminUserDetailsUpdate('dunyao@unsw.edu.au', 'abCdddD1232', 'Nick', 'Sebastian');
  expect(user1.error).toEqual(expect.any(String));
});

test.each([
  ['dunyaounsw.edu.au', 'abcd1234', 'DunYao', 'Foo'],
  ['dunyao@unsw', 'abcd1234', 'DunYao', 'Foo'],
  ['dunyao@', 'abcd1234', 'DunYao', 'Foo'],
]) ('Invalid email: Incorrect input', (email, password, nameFirst, nameLast) => {
  let user1 = adminAuthRegister('dunyao@unsw.edu.au', 'abCdddD123', 'DunYao', 'Foo');
  user1 = adminUserDetailsUpdate(email, password, nameFirst, nameLast);
  expect(user1.error).toEqual(expect.any(String));
});
test.each([
  ['dunyao@unsw.edu.au', 'abcd1234', '1984', 'Foo'],
  ['dunyao@unsw.edu.au', 'abcd1234', '?+-/*)(*&^%$#@!~`:><,.={}\|', 'Foo'],
  ['dunyao@unsw.edu.au', 'abcd1234', 'Dun Yao123', 'Foo'],
]) ('Invalid first name: Characters', (email, password, nameFirst, nameLast) => {
  let user1 = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
  user1 = adminUserDetailsUpdate(email, password, nameFirst, nameLast);
  expect(user1.error).toEqual(expect.any(String));
});

test.each([
  ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '1984'],
  ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '?+-/*)(*&^%$#@!~`:><,.={}\|'],
  ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Dun Yao123'],
]) ('Invalid last name: Characters', (email, password, nameFirst, nameLast) => {
  let user1 = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
  user1 = adminUserDetailsUpdate(email, password, nameFirst, nameLast);
  expect(user1.error).toEqual(expect.any(String));
});
test.each([
  ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '1984'],
  ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '?+-/*)(*&^%$#@!~`:><,.={}\|'],
  ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Dun Yao123'],
]) ('blank last name', (email, password, nameFirst, nameLast) => {
  clear();
  let user1 = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
  user1 = adminUserDetailsUpdate(email, password, nameFirst, );
  expect(user1.error).toEqual(expect.any(String));
});
test.each([
  ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '1984'],
  ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '?+-/*)(*&^%$#@!~`:><,.={}\|'],
  ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Dun Yao123'],
]) ('blank first name', (email, password, nameFirst, nameLast) => {
  clear();
  let user1 = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
  user1 = adminUserDetailsUpdate(email, password, ' ', nameLast);
  expect(user1.error).toEqual(expect.any(String));
});
test.each([
  ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '1984'],
  ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '?+-/*)(*&^%$#@!~`:><,.={}\|'],
  ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Dun Yao123'],
]) ('blank password', (email, password, nameFirst, nameLast) => {
  clear();
  let user1 = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
  user1 = adminUserDetailsUpdate(email, '', nameFirst, nameLast);
  expect(user1.error).toEqual(expect.any(String));
});
test.each([
  ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '1984'],
  ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '?+-/*)(*&^%$#@!~`:><,.={}\|'],
  ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Dun Yao123'],
]) ('blank email', (email, password, nameFirst, nameLast) => {
  clear();
  let user1 = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
  user1 = adminUserDetailsUpdate('', password, nameFirst, nameLast);
  expect(user1.error).toEqual(expect.any(String));
});
test.each([
  ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'a'],
  ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'abcdefghijklmnopqrstu'],
  ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'abcdefghijklmnopqrstuv'],
]) ('Invalid last name: Length', (email, password, nameFirst, nameLast) => {
  let user1 = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
  user1 = adminUserDetailsUpdate(email, password, nameFirst, nameLast);
  expect(user1.error).toEqual(expect.any(String));
});

describe('adminUserPasswordUpdate', () => {
  test('Comprehensive Test Successful: Logging on after changing the password', () => {
    let adminId = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
    let passwordChange = adminUserPasswordUpdate(adminId.authUserId, 'abcd1234', 'efgh5678');
    expect(passwordChange).toStrictEqual({});
    let idCheck = adminAuthLogin('abcd.efgh@gmail.com', 'efgh5678');
    expect(idCheck).toStrictEqual(adminId);
  });

  test('Test Successful Password Update', () => {
    let adminId = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
    let passwordChange = adminUserPasswordUpdate(adminId.authUserId, 'abcd1234', 'efgh5678');
    expect(passwordChange).toStrictEqual({});
  });

  test('Comprehensive Test Successful: Changing Passwords a bunch of times and checking if it works by logging in', () => {
    let adminId = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
    let passwordChange = adminUserPasswordUpdate(adminId.authUserId, 'abcd1234', 'efgh5678');
    expect(passwordChange).toStrictEqual({});
    passwordChange = adminUserPasswordUpdate(adminId.authUserId, 'efgh5678', 'password1234');
    expect(passwordChange).toStrictEqual({});
    passwordChange = adminUserPasswordUpdate(adminId.authUserId, 'password1234', 'fortress9871');
    expect(passwordChange).toStrictEqual({});
    passwordChange = adminUserPasswordUpdate(adminId.authUserId, 'fortress9871', 'columbus1071');
    expect(passwordChange).toStrictEqual({});
    passwordChange = adminUserPasswordUpdate(adminId.authUserId, 'columbus1071', 'pirate981');
    expect(passwordChange).toStrictEqual({});
    let idCheck = adminAuthLogin('abcd.efgh@gmail.com', 'pirate981');
    expect(idCheck).toStrictEqual(adminId);
  });
  
  test('Comprehensive Test Unsuccessful: Trying to log in after trying to change to an invalid pass', () => {
    let adminId = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
    let passwordChange = adminUserPasswordUpdate(adminId.authUserId, 'abcd1234', 'abcd1234');
    expect(passwordChange.error).toStrictEqual(expect.any(String));
    let idCheck = adminAuthLogin('abcd.efgh@gmail.com', 'abcd1234');
    expect(idCheck).toStrictEqual(adminId);
  });
  
  test('Test Unsuccessful: Auth User ID invalid', () => {
    let adminId = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
    adminId.authUserId++;
    let passwordChange = adminUserPasswordUpdate(adminId.authUserId, 'abcd1234', 'efgh5678');
    expect(passwordChange.error).toStrictEqual(expect.any(String));
  });
  
  test('Test Unsuccessful: Old Password Incorrect', () => {
    let adminId = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
    let passwordChange = adminUserPasswordUpdate(adminId.authUserId, 'aecd1234', 'efgh5678');
    expect(passwordChange.error).toStrictEqual(expect.any(String));
  });
  
  test('Test Unsuccessful: Passwords are the Same', () => {
    let adminId = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
    let passwordChange = adminUserPasswordUpdate(adminId.authUserId, 'abcd1234', 'abcd1234');
    expect(passwordChange.error).toStrictEqual(expect.any(String));
  });

  test('Test Unsuccessful: New Password Matches Old Password', () => {
    let adminId = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
    let passwordChange = adminUserPasswordUpdate(adminId.authUserId, 'abcd1234', 'efgh5678');
    passwordChange = adminUserPasswordUpdate(adminId.authUserId, 'efgh5678', 'abcd1234');
    expect(passwordChange.error).toStrictEqual(expect.any(String));
  });

  test('Test Unsuccessful: Password less than 8 charachters', () => {
    let adminId = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
    let passwordChange = adminUserPasswordUpdate(adminId.authUserId, 'abcd1234', 'efgh567');
    expect(passwordChange.error).toStrictEqual(expect.any(String));
  });

  test('Test Unsuccessful: Password does not contain at least one number and at least one letter', () => {
    let adminId = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
    let passwordChange = adminUserPasswordUpdate(adminId.authUserId, 'abcd1234', '***********');
    expect(passwordChange.error).toStrictEqual(expect.any(String));
  });
});