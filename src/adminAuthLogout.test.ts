import {
  clear,
  adminAuthRegister,
  adminAuthLogin,
  adminUserDetails,
  adminUserDetailsUpdate,
  adminUserPasswordUpdate,
  adminAuthLogout
} from './testHelpers';

beforeEach(() => {
  clear();
});

describe ('Testing POST /v1/admin/auth/logout', () => {
  let token: string;
  beforeEach(() => {
    const { jsonBody } = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');

    token = jsonBody.token;
  });
  
  test('Successful logout', () => {
    const { statusCode, jsonBody } = adminAuthLogout(token);
    
    expect(statusCode).toStrictEqual(200);
    expect(jsonBody).toStrictEqual({});

    expect(adminAuthLogin('dunyao@unsw.edu.au', 'abcd1234')).toStrictEqual(
      {
        statusCode: 400,
        jsonBody: { error: expect.any(String) }
      }
    );
    
    expect(adminUserDetails(token)).toStrictEqual(
      {
        statusCode: 401,
        jsonBody: { error: expect.any(String) }
      }
    );
    
    // expect(adminUserDetailsUpdate(token, 'dunyao@unsw.edu.au', 'Sam', 'Jeong')).toStrictEqual(
    //   {
    //     statusCode: 401,
    //     jsonBody: { error: expect.any(String) }
    //   }
    // );
    
    // expect(adminUserPasswordUpdate(token, 'abcd1234', '1234abcd')).toStrictEqual(
    //   {
    //     statusCode: 401,
    //     jsonBody: { error: expect.any(String) }
    //   }
    // );
  });

  test('Invalid token', () => {
    expect(adminAuthLogout(token)).toStrictEqual(
      {
        statusCode: 401,
        jsonBody: { error: expect.any(String) }
      }
    );
  });
});