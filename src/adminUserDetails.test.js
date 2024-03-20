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

describe('adminUserDetails', () => {
  test('correct return type', () => {
    const admin = adminAuthRegister('Dilhanm@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');

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
    const admin = adminAuthRegister('Dilhanm@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');

    expect(adminUserDetails(admin.authUserId + 1)).toStrictEqual({ error: expect.any(String) });
  });

  test('correct return type when userid is wrong', () => {
    const admin = adminAuthRegister('Dilhanm@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');
    expect(adminUserDetails(admin.authUserId - 2)).toStrictEqual({ error: expect.any(String) });
  });

  test('name and email functionality', () => {
    const admin = adminAuthRegister('dilhanmr@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');
    const admin2 = adminAuthRegister('DunYao@hotmail.com', 'abCdddD123', 'DunYao', 'Foo');
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
    const admin = adminAuthRegister('dilhanm@gmail.com', 'abCddddD123', 'Dilhan', 'Mert');

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
    const admin = adminAuthRegister('dilhanmr@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');

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
