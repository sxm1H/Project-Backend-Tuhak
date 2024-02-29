import test from 'node:test';
import { clear } from 'console';
import {
  adminAuthLogin, 
  adminAuthRegister,
  adminUserDetails,
  adminUserDetailsUpdate,
  adminUserPasswordUpdate,
 } from './auth.js'

describe('adminAuthRegister', () => {
  test('Successful registration', () => {
    clear();
    let user = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
    expect(user.authUserId).toBeDefined();
  });
  
  test('Invalid email: Used by another user', () => {
    clear();
    let user1 = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
    let user2 = adminAuthRegister('dunyao@unsw.edu.au', 'bingbong', 'Nick', 'Sebastian');
    expect(user2.error).toStrictEqual('Email is already used.');
  });

  test.each([
    ['dunyaounsw.edu.au', 'abcd1234', 'DunYao', 'Foo'],
    ['dunyao@unsw', 'abcd1234', 'DunYao', 'Foo'],
  ]) ('Invalid email: Incorrect input', (email, password, nameFirst, nameLast) => {
    clear();
    let user = adminAuthRegister(email, password, nameFirst, nameLast);
    expect(user.error).toStrictEqual('Invalid email.');
  })
  
  test.each([
    ['dunyao@unsw.edu.au', 'abcd1234', '1984', 'Foo'],
    ['dunyao@unsw.edu.au', 'abcd1234', '?+-/*)(*&^%$#@!~`:><,.={}\|', 'Foo'],
  ]) ('Invalid first name: Characters', (email, password, nameFirst, nameLast) => {
    clear();
    let user = adminAuthRegister(email, password, nameFirst, nameLast);
    expect(user.error).toStrictEqual('Invalid characters in first name.');
  });
  
  test.each([
    ['dunyao@unsw.edu.au', 'abcd1234', 'o', 'Foo'],
    ['dunyao@unsw.edu.au', 'abcd1234', 'abcdefghijklmnopqrstu', 'Foo'],
  ]) ('Invalid first name: Length', (email, password, nameFirst, nameLast) => {
    clear();
    let user = adminAuthRegister(email, password, nameFirst, nameLast);
    expect(user.error).toStrictEqual('Invalid first name length.');
  });
  
  test('Invalid password: Length', () => {
    clear();
    let user = adminAuthRegister('dunyao@unsw.edu.au', 'abcd', 'DunYao', 'Foo');
    expect(user.error).toStrictEqual('Password must be at least 8 characters.');
  });

  test.each([
    ['dunyao@unsw.edu.au', '12345678', 'DunYao', 'Foo'],
    ['dunyao@unsw.edu.au', 'abcdefgh', 'DunYao', 'Foo'],
  ]) ('Invalid password: Characters', (email, password, nameFirst, nameLast) => {
    clear();
    let user = adminAuthRegister(email, password, nameFirst, nameLast);
    expect(user.error).toStrictEqual('Password needs at least one number and at least one letter.');
  });
  
});