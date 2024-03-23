// import { 
//   clear,
//   adminAuthRegister,
//   adminUserDetails,
//   adminUserDetailsUpdate,
//  } from './testHelpers';

// beforeEach(() => {
//   clear();
// });

// describe('adminUserDetailsUpdate', () => {
//   test('Admin updates user details successfully', () => {
//     const {jsonBody: {authUserId} } = adminAuthRegister('dilhanmr@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');
//     adminUserDetailsUpdate(authUserId, 'dilhanmert@gmail.com', 'Dun Yao', 'Foo');
//     const {statusCode, jsonBody} = adminUserDetails(authUserId);
//     expect(statusCode).toStrictEqual(200);
//     expect(jsonBody).toStrictEqual({
//       user: {
//         userId: authUserId,
//         name: 'Dun Yao Foo',
//         email: 'dilhanmert@gmail.com',
//         numSuccessfulLogins: 1,
//         numFailedPasswordsSinceLastLogin: 0,
//       }
//     });
//   });

//   test('Admin updates user details successfully with multiple users', () => {
//     {
//       const {jsonBody: {authUserId} } = adminAuthRegister('dilhanmr@gmail.com', 'abCdddD123', 'Dilhan', 'Mert');
//       adminUserDetailsUpdate(authUserId, 'dilhanmert@gmail.com', 'Dun Yao', 'Foo');
//       const {statusCode, jsonBody} = adminUserDetails(authUserId);
//       expect(statusCode).toStrictEqual(200);
//       expect(jsonBody).toStrictEqual({
//         user: {
//           userId: authUserId,
//           name: 'Dun Yao Foo',
//           email: 'dilhanmert@gmail.com',
//           numSuccessfulLogins: 1,
//           numFailedPasswordsSinceLastLogin: 0,
//         }
//       });
//     }

//     {
//       const { jsonBody } = adminAuthRegister('DunYao@hotmail.com', 'abCdddD123', 'DunYao', 'Foo');
//       const authUserId2 = jsonBody && jsonBody.authUserId2;
//       if (authUserId2) {

//         adminUserDetailsUpdate(authUserId2, 'samueljeong@gmail.com', 'Samuel', 'Jeong');
        
//         const { statusCode, jsonBody: userDetailsJson } = adminUserDetails(authUserId2);
//         expect(statusCode).toStrictEqual(200);
//         expect(userDetailsJson).toStrictEqual({
//           user: {
//             userId: authUserId2,
//             name: 'Samuel Jeong',
//             email: 'samueljeong@gmail.com',
//             numSuccessfulLogins: 1,
//             numFailedPasswordsSinceLastLogin: 0,
//           }
//         });
//       } 
//     }

//     {
//       const { jsonBody } = adminAuthRegister('SamiHossaini@hotmail.com', 'abCdddD123', 'Sami', 'Hossaini');
//       const authUserId3 = jsonBody && jsonBody.authUserId3;
//       if (authUserId3) {
//         adminUserDetailsUpdate(authUserId3, 'dunyao@gmail.com', 'Dun Yao', 'Foo');
//         const { statusCode, jsonBody: userDetailsJson } = adminUserDetails(authUserId3);
//         expect(statusCode).toStrictEqual(200);
//         expect(userDetailsJson).toStrictEqual({
//           user: {
//             userId: authUserId3,
//             name: 'Dun Yao Foo',
//             email: 'dunyao@gmail.com',
//             numSuccessfulLogins: 1,
//             numFailedPasswordsSinceLastLogin: 0,
//           }
//         });
//       } 
//     }
    
//   });

//   test('Invalid email: Used by another user', () => {
//     const {jsonBody: {authUserId: authUserId1}} = adminAuthRegister('dunyao@unsw.edu.au', 'abCdddD123', 'DunYao', 'Foo');
    
//     const {jsonBody: {authUserId: authUserId2}} = adminAuthRegister('nicksebastian@unsw.edu.au', 'abCdddD1232', 'Nick', 'Sebastian');
//     const {statusCode, jsonBody} = adminUserDetailsUpdate(authUserId2, 'dunyao@unsw.edu.au', 'Nick', 'Sebastian');

//     expect(statusCode).toStrictEqual(400);
//     expect(jsonBody.error).toStrictEqual(expect.any(String));
//   });

//   describe.each([
//     ['dunyaounsw.edu.au', 'abcd1234', 'DunYao', 'Foo'],
//     ['dunyao@unsw', 'abcd1234', 'DunYao', 'Foo'],
//     ['dunyao@', 'abcd1234', 'DunYao', 'Foo'],
//   ])('Invalid email: Incorrect input', (email, password, nameFirst, nameLast) => {
//     test(`Attempt to update with invalid email ${email}`, () => {
//       const {jsonBody: {authUserId}} = adminAuthRegister('validemail@unsw.edu.au', 'abCdddD123', 'ValidName', 'ValidLast');     
//       const {statusCode, jsonBody} = adminUserDetailsUpdate(authUserId, email, nameFirst, nameLast);

//       expect(statusCode).toStrictEqual(400); 
//       expect(jsonBody.error).toStrictEqual(expect.any(String));
//     });
//   });

//   describe.each([
//     ['dunyao@unsw.edu.au', 'abcd1234', '1984', 'Foo'],
//     ['dunyao@unsw.edu.au', 'abcd1234', '?+-/*)(*&^%$#@!~`:><,.={}\|', 'Foo'],
//     ['dunyao@unsw.edu.au', 'abcd1234', 'Dun Yao123', 'Foo'],
//   ])('Invalid first name: Characters', (email, password, nameFirst, nameLast) => {
//     test(`Attempt to update with invalid first name "${nameFirst}"`, () => {
//       const {jsonBody: {authUserId}} = adminAuthRegister(email, 'securePassword123!', 'ValidName', 'ValidLast');
//       const {statusCode, jsonBody} = adminUserDetailsUpdate(authUserId, email, nameFirst, nameLast);

//       expect(statusCode).toStrictEqual(400); 
//       expect(jsonBody.error).toStrictEqual(expect.any(String));
//     });
//   });

//   describe.each([
//     ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '1984'],
//     ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '?+-/*)(*&^%$#@!~`:><,.={}\|'],
//     ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Dun Yao123'],
//   ])('Invalid last name: Characters', (email, password, nameFirst, nameLast) => {
//     test(`Attempt to update with invalid last name "${nameLast}"`, () => {
//       const {jsonBody: {authUserId}} = adminAuthRegister(email, password, nameFirst, 'ValidLast');
//       const {statusCode, jsonBody} = adminUserDetailsUpdate(authUserId, email, nameFirst, nameLast);

//       expect(statusCode).toStrictEqual(400);
//       expect(jsonBody.error).toStrictEqual(expect.any(String));
//     });
//   });

//   describe('Blank last name', () => {
//     test('Attempt to update with a blank last name', () => {
//       const {jsonBody: {authUserId}} = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
//       const {statusCode, jsonBody} = adminUserDetailsUpdate(authUserId, 'dunyao@unsw.edu.au', 'DunYao', '');

//       expect(statusCode).toStrictEqual(400); 
//       expect(jsonBody.error).toStrictEqual(expect.any(String));
//     });
//   });

//   describe.each([
//     ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '1984'],
//     ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '?+-/*)(*&^%$#@!~`:><,.={}\|'],
//     ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Dun Yao123'],
//   ])('Blank first name', (email, password, nameFirst, nameLast) => {
//     test(`Attempt to update with a blank first name, given last name "${nameLast}"`, () => {
//       const {jsonBody: {authUserId}} = adminAuthRegister(email, password, nameFirst, nameLast);
//       const {statusCode, jsonBody} = adminUserDetailsUpdate(authUserId, email, ' ', nameLast);

//       expect(statusCode).toStrictEqual(400);
//       expect(jsonBody.error).toStrictEqual(expect.any(String));
//     });
//   });

  
//   describe.each([
//     ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '1984'],
//     ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', '?+-/*)(*&^%$#@!~`:><,.={}\|'],
//     ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Dun Yao123'],
//   ])('Blank email', (email, password, nameFirst, nameLast) => {
//     test(`Attempt to update with a blank email, given names "${nameFirst} ${nameLast}"`, () => {
//       const {jsonBody: {authUserId}} = adminAuthRegister(email, password, nameFirst, nameLast);
//       const {statusCode, jsonBody} = adminUserDetailsUpdate(authUserId, '', nameFirst, nameLast);

//       expect(statusCode).toStrictEqual(400); 
//       expect(jsonBody.error).toStrictEqual(expect.any(String));
//     });
//   });

//   describe.each([
//     ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'a'], 
//     ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'abcdefghijklmnopqafssafasrstu'], 
//     ['dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'abcdefghijklmnopqfafsaasfrstuv'], 
//   ])('Invalid last name: Length', (email, password, nameFirst, nameLast) => {
//     test(`Attempt to update with invalid last name length "${nameLast}"`, () => {
//       const {jsonBody: {authUserId}} = adminAuthRegister(email, password, nameFirst, 'ValidLast');
//       const {statusCode, jsonBody} = adminUserDetailsUpdate(authUserId, email, nameFirst, nameLast);

//       expect(statusCode).toStrictEqual(400); 
//       expect(jsonBody.error).toStrictEqual(expect.any(String));
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