// import {
//   clear,
//   adminAuthRegister,
//   adminAuthLogin,
//   adminUserDetails,
//   adminUserDetailsUpdate,
//   adminUserPasswordUpdate,
//   adminAuthLogout
// } from './testHelpersIter2';

// import HTTPError from 'http-errors';

// let token: string;
// beforeEach(() => {
//   clear();

//   token = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo').jsonBody.token;
// });

// describe('Testing POST /v1/admin/auth/logout', () => {
//   test('Successful logout', () => {
//     expect(adminAuthLogout(token)).toStrictEqual({});
    
//     expect(() => adminUserDetails(token)).toThrow(HTTPError[401]);

//     expect(() => adminUserDetails(token)).toThrow(HTTPError[401]);

//     expect(() => adminUserPasswordUpdate(token, 'abcd1234', '1234abcd')).toThrow(HTTPError[401]);
//   });

//   test('Successful logout with multiple sessions', () => {
//     const log = adminAuthLogin('dunyao@unsw.edu.au', 'abcd1234');

//     expect(adminAuthLogout(token)).toStrictEqual({});

//     expect(adminUserDetails(log.token)).toStrictEqual(
//       {
//         statusCode: 200,
//         jsonBody: {
//           user: {
//             userId: expect.any(Number),
//             name: 'DunYao Foo',
//             email: 'dunyao@unsw.edu.au',
//             numSuccessfulLogins: 2,
//             numFailedPasswordsSinceLastLogin: 0,
//           }
//         }
//       }
//     );

//     expect(adminUserDetailsUpdate(log.token, 'dunyao@unsw.edu.au', 'Sam', 'Jeong')).toStrictEqual({});

//     expect(adminUserPasswordUpdate(log.token, 'abcd1234', '1234abcd')).toStrictEqual(
//       {
//         statusCode: 200,
//         jsonBody: {}
//       }
//     );
//   });

//   test('Invalid token', () => {

//     expect(() => adminAuthLogout(token + 'hello')).toThrow(HTTPError[401]);
//   });
// });

test('temp', () => {
  expect(2 + 2).toBe(4);
});