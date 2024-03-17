import { clear } from './other.js';
import {
  adminAuthLogin, 
  adminAuthRegister,
  adminUserDetails,
  adminUserDetailsUpdate,
  adminUserPasswordUpdate
} from './auth.js';

beforeEach(() => {
  clear();
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

  test('correct return type when userid is wrong', () => {
    let admin = adminAuthRegister('Dilhanm@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');

    expect(adminUserDetails(admin.authUserId + 1)).toStrictEqual({ error: expect.any(String) });
  });

  test('correct return type when userid is wrong', () => {
    let admin = adminAuthRegister('Dilhanm@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');
    expect(adminUserDetails(admin.authUserId - 2)).toStrictEqual({ error: expect.any(String) });
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