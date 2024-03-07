
import { clear } from './other.js';
import {
  adminAuthLogin, 
  adminAuthRegister,
  adminUserDetails,
  adminUserDetailsUpdate,
  adminUserPasswordUpdate,
 } from './auth.js'

beforeEach(() => {
  clear();
})

describe('adminAuthLogin', () => {
    test('Successful auth login', () => {
      let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');

      adminAuthRegister('sami@gmail.com', 'sami1234', 'Sami', 'Hossein');
      adminAuthRegister('kyle1234@gmail.com', 'kyle1234', 'Kyle', 'Morley');

      let userLog = adminAuthLogin('nick1234@gmail.com', 'nick1234')

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

  test('Successful registration', () => {
    let user = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
    expect(user.authUserId).toBeDefined();
  });
  
  test('Invalid email: Used by another user', () => {
    let user1 = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
    let user2 = adminAuthRegister('dunyao@unsw.edu.au', '1234abcd', 'Nick', 'Sebastian');
    expect(user2.error).toEqual(expect.any(String));
  });

  test.each([
    ['dunyaounsw.edu.au', 'abcd1234', 'DunYao', 'Foo'],
    ['dunyao@unsw', 'abcd1234', 'DunYao', 'Foo'],
    ['dunyao@', 'abcd1234', 'DunYao', 'Foo'],
  ]) ('Invalid email: Incorrect input', (email, password, nameFirst, nameLast) => {
    let user = adminAuthRegister(email, password, nameFirst, nameLast);
    expect(user.error).toEqual(expect.any(String));
  })
  
  test.each([
    ['dunyao@unsw.edu.au', 'abcd1234', '1984', 'Foo'],
    ['dunyao@unsw.edu.au', 'abcd1234', '?+-/*)(*&^%$#@!~`:><,.={}\|', 'Foo'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'Dun Yao123', 'Foo'],
  ]) ('Invalid first name: Characters', (email, password, nameFirst, nameLast) => {
    let user = adminAuthRegister(email, password, nameFirst, nameLast);
    expect(user.error).toEqual(expect.any(String));
  });
  
  test.each([
    ['dunyao@unsw.edu.au', 'abcd1234', 'o', 'Foo'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'abcdefghijklmnopqrstu', 'Foo'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'abcdefghijklmnopqrstuv', 'Foo'],
  ]) ('Invalid first name: Length', (email, password, nameFirst, nameLast) => {
    let user = adminAuthRegister(email, password, nameFirst, nameLast);
    expect(user.error).toEqual(expect.any(String));
  });
  
  test.each([
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '1984'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '?+-/*)(*&^%$#@!~`:><,.={}\|'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Dun Yao123'],
  ]) ('Invalid last name: Characters', (email, password, nameFirst, nameLast) => {
    let user = adminAuthRegister(email, password, nameFirst, nameLast);
    expect(user.error).toEqual(expect.any(String));
  });

  test.each([
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'a'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'abcdefghijklmnopqrstu'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'abcdefghijklmnopqrstuv'],
  ]) ('Invalid last name: Length', (email, password, nameFirst, nameLast) => {
    let user = adminAuthRegister(email, password, nameFirst, nameLast);
    expect(user.error).toEqual(expect.any(String));
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
    expect(user.error).toEqual(expect.any(String));
  });

  test.each([
    ['dunyao@unsw.edu.au', '12345678', 'DunYao', 'Foo'],
    ['dunyao@unsw.edu.au', 'abcdefgh', 'DunYao', 'Foo'],
    ['dunyao@unsw.edu.au', 'ABCDEFGH', 'DunYao', 'Foo'],
  ]) ('Invalid password: Characters', (email, password, nameFirst, nameLast) => {
    let user = adminAuthRegister(email, password, nameFirst, nameLast);
    expect(user.error).toEqual(expect.any(String));
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
    )
  });
  test('correct numSuccessfulLogins', () => {
    let admin = adminAuthRegister('dilhanm@gmail.com', 'abCddddD123', 'Dilhan', 'Mert');
    // login 4 times
    for (let i = 0; i < 4; i++) {
      adminAuthLogin('dilhanm@gmail.com', 'abCddddD123');
    }
    expect(adminUserDetails(admin.authUserId)).toStrictEqual(
      {
        user: {
          userId: expect.any(Number),
          name: expect.any(String),
          email: expect.any(String),
          // num of successful logins should be 5 (logins + registration)
          numSuccessfulLogins: 5,
          numFailedPasswordsSinceLastLogin: expect.any(Number),
        }
      }
    )
  });
  test('correct numFailedPasswordsSinceLastLogin', () => {
    let admin = adminAuthRegister('dilhanmr@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');
    // fail password 3 times
    for (let i = 0; i < 3; i++) {
      adminAuthLogin('dilhanmr@gmail.com', 'abCddddD1232')
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
    // correct password
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

test('Admin updates user details with invalid email format', () => {
  let admin = adminAuthRegister('admin@example.com', 'abCdddD123', 'John', 'Doe');

  const result = adminUserDetailsUpdate(admin.authUserId, 'invalidemail', 'NewName', 'NewLastName');

 
  expect(result).toEqual({
    error: "Invalid email."
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
})
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
  ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'a'],
  ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'abcdefghijklmnopqrstu'],
  ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'abcdefghijklmnopqrstuv'],
]) ('Invalid last name: Length', (email, password, nameFirst, nameLast) => {
  let user1 = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
  user1 = adminUserDetailsUpdate(email, password, nameFirst, nameLast);
  expect(user1.error).toEqual(expect.any(String));
});

describe('adminUserPasswordUpdate', () => {
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
  })
  
  test('Test Unsuccessful: Auth User ID invalid', () => {
      clear();
      let adminId = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
      adminId.authUserId++;
      let passwordChange = adminUserPasswordUpdate(adminId.authUserId, 'abcd1234', 'efgh5678');
      expect(passwordChange.error).toStrictEqual('Auth User ID invalid');
    });
  
    test('Test Unsuccessful: Old Password Incorrect', () => {
      clear();
      let adminId = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
      let passwordChange = adminUserPasswordUpdate(adminId.authUserId, 'aecd1234', 'efgh5678');
      expect(passwordChange.error).toStrictEqual('Password Entered Is Incorrect.');
    });
  
   test('Test Unsuccessful: Passwords are the Same', () => {
      clear();
      let adminId = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
      let passwordChange = adminUserPasswordUpdate(adminId.authUserId, 'abcd1234', 'abcd1234');
      expect(passwordChange.error).toStrictEqual('New Password is the same as old passward.');
    });

    test('Test Unsuccessful: New Password Matches Old Password', () => {
      clear();
      let adminId = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
      let passwordChange = adminUserPasswordUpdate(adminId.authUserId, 'abcd1234', 'efgh5678');
      passwordChange = adminUserPasswordUpdate(adminId.authUserId, 'efgh5678', 'abcd1234');
      expect(passwordChange.error).toStrictEqual('Password has already been used before.');
    });

    test('Test Unsuccessful: Password less than 8 charachters', () => {
      clear();
      let adminId = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
      let passwordChange = adminUserPasswordUpdate(adminId.authUserId, 'abcd1234', 'efgh567');
      expect(passwordChange.error).toStrictEqual('New Password must be at least 8 characters long.');
    });

    test('Test Unsuccessful: Password does not contain at least one number and at least one letter', () => {
      clear();
      let adminId = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
      let passwordChange = adminUserPasswordUpdate(adminId.authUserId, 'abcd1234', '***********');
      expect(passwordChange.error).toStrictEqual('New Password must have at least one number and one letter.');
    });
});