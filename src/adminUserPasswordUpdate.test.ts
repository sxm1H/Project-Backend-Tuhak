// import {
//   requestHelper,
//   clear,
//   adminAuthRegister,
//   adminAuthLogin,
//   adminUserDetails,
//   adminUserDetailsUpdate,
//   adminUserPasswordUpdate,
//   adminQuizList,
//   adminQuizCreate,
//   adminQuizRemove,
//   adminQuizInfo,
//   adminQuizNameUpdate,
//   adminQuizDescriptionUpdate
// } from './testHelpers';

// beforeEach(() => {
//   clear();
// });

// describe('Testing PUT /v1/admin/user/password', () => {
// /*
//   test('Comprehensive Test Successful: Logging on after changing the password', () => {
//     let response = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
//     let adminId = response.jsonBody;

//     response = adminUserPasswordUpdate(adminId.authUserId, 'abcd1234', 'efgh5678');
//     expect(response).toStrictEqual({
//       jsonBody: {},
//       statusCode: 200,
//     });

//     expect(adminAuthLogin('abcd.efgh@gmail.com', 'efgh5678')).toStrictEqual({
//       jsonBody: {},
//       statusCode: 200,
//     });
//   });
// */
//   test('Test Successful Password Update', () => {
//     const response = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
//     const authUserId = response.jsonBody;
//     const passwordChange = adminUserPasswordUpdate(authUserId.authUserId, 'abcd1234', 'efgh5678');

//     expect(passwordChange).toStrictEqual({
//       jsonBody: {},
//       statusCode: 200,
//     });
//   });

//   /*

//   test('Comprehensive Test Successful: Changing Passwords a bunch of times and checking if it works by logging in', () => {
//     let response = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
//     let adminId = response.jsonBody;

//     response = adminUserPasswordUpdate(adminId.authUserId, 'abcd1234', 'efgh5678');
//     expect(response).toStrictEqual({
//       jsonBody: {},
//       statusCode: 200,
//     });

//     response = adminUserPasswordUpdate(adminId.authUserId, 'efgh5678', 'password1234');
//     expect(response).toStrictEqual({
//       jsonBody: {},
//       statusCode: 200,
//     });

//     response = adminUserPasswordUpdate(adminId.authUserId, 'password1234', 'fortress9871');
//     expect(response).toStrictEqual({
//       jsonBody: {},
//       statusCode: 200,
//     });

//     response = adminUserPasswordUpdate(adminId.authUserId, 'fortress9871', 'columbus1071');
//     expect(response).toStrictEqual({
//       jsonBody: {},
//       statusCode: 200,
//     });

//     response = adminUserPasswordUpdate(adminId.authUserId, 'columbus1071', 'pirate981');
//     expect(response).toStrictEqual({
//       jsonBody: {},
//       statusCode: 200,
//     });

//     expect(adminAuthLogin('abcd.efgh@gmail.com', 'pirate981')).toStrictEqual({
//       jsonBody: {
//         authUserId: expect.any(number)
//       },
//       statusCode: 200,
//     });
//   });

//   test('Comprehensive Test Unsuccessful: Trying to log in after trying to change to an invalid pass', () => {
//     let response = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
//     let adminId = response.jsonBody;
//     response = adminUserPasswordUpdate(adminId.authUserId, 'abcd1234', 'abcd1234');

//     expect(response).toStrictEqual({
//       jsonBody: {
//         error: expect.any(string)
//       },
//       statusCode: 400,
//     });

//     reponse = adminAuthLogin('abcd.efgh@gmail.com', 'abcd1234');

//     expect(response).toStrictEqual({
//       jsonBody: {
//         authUserId: expect.any(number)
//       },
//       statusCode: 200,
//     });;
//   });
//   */

//   test('Test Unsuccessful: Auth User ID invalid', () => {
//     let response = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
//     const adminId = response.jsonBody;
//     adminId.authUserId++;
//     response = adminUserPasswordUpdate(adminId.authUserId, 'abcd1234', 'efgh5678');

//     expect(response).toStrictEqual({
//       jsonBody: {
//         error: expect.any(String)
//       },
//       statusCode: 400,
//     });
//   });

//   test('Test Unsuccessful: Old Password Incorrect', () => {
//     let response = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
//     const adminId = response.jsonBody;
//     response = adminUserPasswordUpdate(adminId.authUserId, 'aecd1234', 'efgh5678');

//     expect(response).toStrictEqual({
//       jsonBody: {
//         error: expect.any(String)
//       },
//       statusCode: 400,
//     });
//   });

//   test('Test Unsuccessful: Passwords are the Same', () => {
//     let response = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
//     const adminId = response.jsonBody;
//     response = adminUserPasswordUpdate(adminId.authUserId, 'abcd1234', 'abcd1234');

//     expect(response).toStrictEqual({
//       jsonBody: {
//         error: expect.any(String)
//       },
//       statusCode: 400,
//     });
//   });

//   test('Test Unsuccessful: New Password Matches Old Password', () => {
//     let response = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
//     const adminId = response.jsonBody;
//     adminUserPasswordUpdate(adminId.authUserId, 'abcd1234', 'efgh5678');
//     response = adminUserPasswordUpdate(adminId.authUserId, 'efgh5678', 'abcd1234');

//     expect(response).toStrictEqual({
//       jsonBody: {
//         error: expect.any(String)
//       },
//       statusCode: 400,
//     });
//   });

//   test('Test Unsuccessful: Password less than 8 charachters', () => {
//     let response = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
//     const adminId = response.jsonBody;
//     response = adminUserPasswordUpdate(adminId.authUserId, 'abcd1234', 'efgh567');

//     expect(response).toStrictEqual({
//       jsonBody: {
//         error: expect.any(String)
//       },
//       statusCode: 400,
//     });
//   });

//   test('Test Unsuccessful: Password does not contain at least one number and at least one letter', () => {
//     let response = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
//     const adminId = response.jsonBody;
//     response = adminUserPasswordUpdate(adminId.authUserId, 'abcd1234', '***********');

//     expect(response).toStrictEqual({
//       jsonBody: {
//         error: expect.any(String)
//       },
//       statusCode: 400,
//     });
//   });
// });

// DELETE EVERYTHING UNDER THIS
import { clear, adminAuthRegister } from './testHelpers';
test('Temporary', () => {
  clear();
  expect(adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo')).toStrictEqual(
    {
      statusCode: 200,
      jsonBody: { token: expect.any(String) }
    }
  );
});