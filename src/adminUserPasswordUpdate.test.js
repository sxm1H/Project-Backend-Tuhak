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