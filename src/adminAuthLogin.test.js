import { clear } from './other';
import {
  adminAuthLogin, 
  adminAuthRegister,
  adminUserDetails,
  adminUserDetailsUpdate,
  adminUserPasswordUpdate
} from './auth';

beforeEach(() => {
  clear();
});

describe('adminAuthLogin', () => {

  test('Successful auth login', () => {
    let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');

    adminAuthRegister('sami@gmail.com', 'sami1234', 'Sami', 'Hossein');
    adminAuthRegister('kyle1234@gmail.com', 'kyle1234', 'Kyle', 'Morley');

    let userLog = adminAuthLogin('nick1234@gmail.com', 'nick1234');

    expect(userReg.authUserId).toStrictEqual(userLog.authUserId);
  });

  test('Email address does not exist', () => {
    let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    let error = adminAuthLogin('DunYao@gmail.com', 'nick1234');

    expect(error.error).toStrictEqual(expect.any(String));
  });
    
  test('Password is not correct for the given email.', () => {
    let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    let error = adminAuthLogin('nick1234@gmail.com', 'notTheSamePassword');

    expect(error.error).toStrictEqual(expect.any(String));
  });

  test('Password is not correct for the given email.', () => {
    let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    let error = adminAuthLogin('nick1234@gmail.com', 'notTheSamePassword');

    expect(error.error).toStrictEqual(expect.any(String));
  });

  test('Comprehensive successful tests - testing multiple users IDs are returned correctly', () => {
    let userReg1 = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
    let userReg2 = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    let userReg3 = adminAuthRegister('Sami1234@gmail.com', 'Sami1234', 'Sami', 'Hossain');
    let userReg4 = adminAuthRegister('Samuel1234@gmail.com', 'Samuel1234', 'Samuel', 'Jeong');
    let userReg5 = adminAuthRegister('Dilhan1234@gmail.com', 'Dilhan1234', 'Dilhan', 'Mert');

    let userLog1 = adminAuthLogin('dunyao@unsw.edu.au', 'abcd1234');
    let userLog2 = adminAuthLogin('nick1234@gmail.com', 'nick1234');
    let userLog3 = adminAuthLogin('Sami1234@gmail.com', 'Sami1234');
    let userLog4 = adminAuthLogin('Samuel1234@gmail.com', 'Samuel1234');
    let userLog5 = adminAuthLogin('Dilhan1234@gmail.com', 'Dilhan1234');

    expect(userReg1.authUserId).toStrictEqual(userLog1.authUserId);
    expect(userReg2.authUserId).toStrictEqual(userLog2.authUserId);
    expect(userReg3.authUserId).toStrictEqual(userLog3.authUserId);
    expect(userReg4.authUserId).toStrictEqual(userLog4.authUserId);
    expect(userReg5.authUserId).toStrictEqual(userLog5.authUserId);
  });
});