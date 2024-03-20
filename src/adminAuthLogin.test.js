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

describe('adminAuthLogin', () => {
  test('Successful auth login', () => {
    const userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');

    adminAuthRegister('sami@gmail.com', 'sami1234', 'Sami', 'Hossein');
    adminAuthRegister('kyle1234@gmail.com', 'kyle1234', 'Kyle', 'Morley');

    const userLog = adminAuthLogin('nick1234@gmail.com', 'nick1234');

    expect(userReg.authUserId).toStrictEqual(userLog.authUserId);
  });

  test('Email address does not exist', () => {
    const userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const error = adminAuthLogin('DunYao@gmail.com', 'nick1234');

    expect(error.error).toStrictEqual(expect.any(String));
  });

  test('Password is not correct for the given email.', () => {
    const userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const error = adminAuthLogin('nick1234@gmail.com', 'notTheSamePassword');

    expect(error.error).toStrictEqual(expect.any(String));
  });

  test('Password is not correct for the given email.', () => {
    const userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const error = adminAuthLogin('nick1234@gmail.com', 'notTheSamePassword');

    expect(error.error).toStrictEqual(expect.any(String));
  });

  test('Comprehensive successful tests - testing multiple users IDs are returned correctly', () => {
    const userReg1 = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
    const userReg2 = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const userReg3 = adminAuthRegister('Sami1234@gmail.com', 'Sami1234', 'Sami', 'Hossain');
    const userReg4 = adminAuthRegister('Samuel1234@gmail.com', 'Samuel1234', 'Samuel', 'Jeong');
    const userReg5 = adminAuthRegister('Dilhan1234@gmail.com', 'Dilhan1234', 'Dilhan', 'Mert');

    const userLog1 = adminAuthLogin('dunyao@unsw.edu.au', 'abcd1234');
    const userLog2 = adminAuthLogin('nick1234@gmail.com', 'nick1234');
    const userLog3 = adminAuthLogin('Sami1234@gmail.com', 'Sami1234');
    const userLog4 = adminAuthLogin('Samuel1234@gmail.com', 'Samuel1234');
    const userLog5 = adminAuthLogin('Dilhan1234@gmail.com', 'Dilhan1234');

    expect(userReg1.authUserId).toStrictEqual(userLog1.authUserId);
    expect(userReg2.authUserId).toStrictEqual(userLog2.authUserId);
    expect(userReg3.authUserId).toStrictEqual(userLog3.authUserId);
    expect(userReg4.authUserId).toStrictEqual(userLog4.authUserId);
    expect(userReg5.authUserId).toStrictEqual(userLog5.authUserId);
  });
});
