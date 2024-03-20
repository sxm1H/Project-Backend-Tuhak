import { json } from 'stream/consumers';
import { 
  clear,
  adminAuthRegister,
  adminUserDetails,
  adminAuthLogin,
 } from './testHelpers';

beforeEach(() => {
  clear();
});

describe('adminUserDetails', () => {
  test('correct return type', () => {
    const {jsonBody: {authUserId} } = adminAuthRegister('Dilhanm@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');
    
    const {statusCode, jsonBody} = adminUserDetails(authUserId);
    expect(statusCode).toStrictEqual(200);
    expect(jsonBody).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Dilhan',
        email: 'Dilhanm@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('correct return type when userid is wrong', () => {
    const {jsonBody: {authUserId} }  = adminAuthRegister('Dilhanm@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');

    const wrongAuthUserId = authUserId + 1;

    const {statusCode, jsonBody} = adminUserDetails(wrongAuthUserId);

    expect(statusCode).toStrictEqual(400);
    expect(jsonBody).toStrictEqual({ error: expect.any(String) });
  
  });

  test('name and email functionality', () => {
    const {jsonBody: {authUserId} }  = adminAuthRegister('dilhanmr@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');
    const {jsonBody: {authUserId2} }  = adminAuthRegister('DunYao@hotmail.com', 'abCdddD123', 'DunYao', 'Foo');
    const {statusCode, jsonBody} = adminUserDetails(authUserId2);

    expect(statusCode).toStrictEqual(200);

    expect(jsonBody).toStrictEqual(
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
    const {jsonBody: {authUserId} }  = adminAuthRegister('dilhanm@gmail.com', 'abCddddD123', 'Dilhan', 'Mert');

    for (let i = 0; i < 4; i++) {
      const {statusCode, jsonBody} =  adminAuthLogin('dilhanm@gmail.com', 'abCddddD123');
    }

    const {statusCode, jsonBody} = adminUserDetails(authUserId);

    expect(statusCode).toStrictEqual(200);
    expect(jsonBody).toStrictEqual(
      {
        user: {
          userId: expect.any(Number),
          name: 'Dilhan Mert',
          email: 'dilhanm@gmail.com',
          numSuccessfulLogins: 5,
          numFailedPasswordsSinceLastLogin: 0,
        }
      }
    );
  });

  test('correct numFailedPasswordsSinceLastLogin', () => {
    const {jsonBody: {authUserId} }  = adminAuthRegister('dilhanmr@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');

    for (let i = 0; i < 3; i++) {
      const {statusCode, jsonBody} = adminAuthLogin('dilhanmr@gmail.com', 'abCddddD1232');
    }
    const {statusCode, jsonBody} = adminUserDetails(authUserId);

    expect(statusCode).toStrictEqual(400);
    expect(jsonBody).toStrictEqual({
      user: {
        userId: expect.any(Number),
        name: 'Dilhan Mert',
        email: 'dilhanmr@gmail.com',
        numSuccessfulLogins: 0,
        numFailedPasswordsSinceLastLogin: 3,
      }
    });
  });
});
