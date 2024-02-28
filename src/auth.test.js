import { adminAuthLogin } from './auth.js';
import { clear } from './other.js';

describe('adminAuthLogin', () => {
    test('Successful auth login', () => {
      clear();
      let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
      let userLog = adminAuthLogin('nick1234@gmail.com', 'nick1234')

      expect(userReg.authUserId).toBe(userLog.authUserId);
    });
    test('Email address does not exist', () => {
      clear();
      let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
      let error = adminAuthLogin('DunYao@gmail.com', 'nick1234');

      expect(error).toBe({error: 'Email address does not exist.'});
    });
    test('Password is not correct for the given email.', () => {
      clear();

      let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
      let error = adminAuthLogin('nick1234@gmail.com', 'notTheSamePassword');

      expect(error).toBe({error: 'Password is not correct for the given email.'});
    });
  });