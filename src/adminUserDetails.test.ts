
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
    const {jsonBody: {authUserId} }  = adminAuthRegister('Dilhanm@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');
    
    const {statusCode, jsonBody} = adminUserDetails(authUserId);
    
    expect(statusCode).toStrictEqual(200);
    expect(jsonBody).toStrictEqual(  {
      user: {
        userId: expect.any(Number),
        name: 'Dilhan Mert',
        email: 'Dilhanm@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }}
    )
    })
  });
  

  test('correct return type when userid is wrong', () => {
    const {jsonBody: {authUserId} }  = adminAuthRegister('Dilhanm@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');

    const wrongAuthUserId = authUserId + 1;

    const {statusCode, jsonBody} = adminUserDetails(wrongAuthUserId);

    expect(statusCode).toStrictEqual(400);
    expect(jsonBody).toStrictEqual({ error: expect.any(String) });
  
  });

  test('name and email functionality', () => {
    const { jsonBody: { authUserId } } = adminAuthRegister('dilhanmr@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');
    const { jsonBody } = adminAuthRegister('DunYao@hotmail.com', 'abCdddD123', 'DunYao', 'Foo');
    const authUserId2 = jsonBody && jsonBody.authUserId2;
    
    if (authUserId2) {
      const { statusCode, jsonBody: userDetailsJson } = adminUserDetails(authUserId2);
  
      expect(statusCode).toStrictEqual(200);
      expect(userDetailsJson).toStrictEqual({
        user: {
          userId: expect.any(Number),
          name: 'Dun Yao Foo',
          email: 'DunYao@hotmail.com',
          numSuccessfulLogins: 1,
          numFailedPasswordsSinceLastLogin: 0,
        }
      });
    }

  });
  
/*
  test('correct numSuccessfulLogins', () => {
    const {jsonBody: {authUserId} }  = adminAuthRegister('dilhanm@gmail.com', 'abCddddD123', 'Dilhan', 'Mert');

    for (let i = 0; i < 4; i++) {
      const {statusCode, jsonBody} =  adminAuthLogin('dilhanm@gmail.com', 'abCddddD123');
      expect(statusCode).toStrictEqual(200)
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
    const {jsonBody: {authUserId} }  = adminAuthRegister('Dilhanm@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');
    
    for (let i = 0; i < 3; i++) {
      const {statusCode, jsonBody} = adminAuthLogin('Dilhanm@gmail.com', 'abCddddD1232');
      expect(statusCode).toStrictEqual(400);
    }

    const userdet = adminUserDetails(authUserId.authUserId);

    
    expect(userdet).toStrictEqual( {
      jsonBody: {user: {
          userId: 1,
          name: 'Dilhan Mert',
          email: 'Dilhanm@gmail.com',
          numSuccessfulLogins: 0,
          numFailedPasswordsSinceLastLogin: 3,
        
      }},
      statusCode: 200,
    });
  });
*/
