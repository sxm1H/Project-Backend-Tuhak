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

// describe('Testing PUT v1/admin/quiz/:quizid/description', () => {
// /*
//   test.only('Comprehensive Test Successful: Using Quiz Info to check whether the desc has been updated', () => {
//     let response = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
//     let adminId = response.jsonBody;

//     response = adminQuizCreate(adminId.authUserId, 'Australian Cities', 'lorem ipsum');
//     let quizId = response.jsonBody;

//     console.log(adminId, quizId);
    
//     expect(adminQuizDescriptionUpdate(adminId.authUserId, quizId.quizId, 'lorem ipsum decorum')).toStrictEqual({
//       jsonBody: { },
//       statusCode: 200,
//     });

//     response = adminQuizInfo(adminId.authUserId, quizId.quizId);
//     expect(response.jsonBody.description).toStrictEqual('lorem ipsum decorum');
//     expect(response.statusCode).toStrictEqual(200);
//   });


//   test('Comprehensive Test Successful: Using Quiz Info to check updated desc when the user has multiple quizzes.', () => {
//     const adminId = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh').jsonBody;
//     adminQuizCreate(adminId.authUserId, 'Australian Tourist Attractions', 'lorem ipsum');
//     adminQuizCreate(adminId.authUserId, 'Australian Beaches', 'lorem ipsum');
//     const quizId = adminQuizCreate(adminId.authUserId, 'Australian Cities', 'lorem ipsum').jsonBody;
//     adminQuizCreate(adminId.authUserId, 'Australian States', 'lorem ipsum');

//     expect(adminQuizDescriptionUpdate(adminId.authUserId, quizId.quizId, 'lorem ipsum decorum')).toStrictEqual({
//       jsonBody: { },
//       statusCode: 200,
//     });
//     expect(adminQuizInfo(adminId.authUserId, quizId.quizId).jsonBody.description).toStrictEqual('lorem ipsum decorum');
//   });
// */
//   test('Test Successful Quiz Description Update', () => {
//     const adminId = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh').jsonBody;
//     const quizId = adminQuizCreate(adminId.authUserId, 'Australian Cities', 'lorem ipsum').jsonBody;

//     expect(adminQuizDescriptionUpdate(adminId.authUserId, quizId.quizId, 'lorem ipsum decorum')).toStrictEqual({
//       jsonBody: { },
//       statusCode: 200,
//     });
//   });

//   test('Test Unsuccessful: Auth User ID invalid', () => {
//     const adminId = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh').jsonBody;
//     const quizId = adminQuizCreate(adminId.authUserId, 'Australian Cities', 'lorem ipsum').jsonBody;
//     const valid = adminQuizDescriptionUpdate(-1, quizId.quizId, 'lorem ipsum decorum'); // Since authId are positive, -1 is an obvious invalid id.

//     expect(valid).toStrictEqual({
//       jsonBody: {
//         error: expect.any(String)
//       },
//       statusCode: 400,
//     });
//   });

//   test('Test Unsuccessful: Quiz ID invalid', () => {
//     const adminId = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh').jsonBody;
//     const quizId = adminQuizCreate(adminId.authUserId, 'Australian Cities', 'lorem ipsum').jsonBody;
//     const valid = adminQuizDescriptionUpdate(adminId.authUserId, 1234, 'lorem ipsum decorum'); // 1234 being an obvious not authorised quizId.
//     expect(valid).toStrictEqual({
//       jsonBody: {
//         error: expect.any(String)
//       },
//       statusCode: 400,
//     });
//   });

//   test('Test Unsuccessful: Desc Too Long', () => {
//     const adminId = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh').jsonBody;
//     const quizId = adminQuizCreate(adminId.authUserId, 'Australian Cities', 'lorem ipsum').jsonBody;
//     const valid = adminQuizDescriptionUpdate(adminId.authUserId, quizId.quizId, 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?');

//     expect(valid).toStrictEqual({
//       jsonBody: {
//         error: expect.any(String)
//       },
//       statusCode: 400,
//     });
//   });

//   test('Test Unsuccessful: Quiz Is Not Owned By User', () => {
//     const adminId1 = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh').jsonBody;
//     const adminId2 = adminAuthRegister('qwert.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh').jsonBody;
//     const quizId = adminQuizCreate(adminId2.authUserId, 'Australian Cities', 'lorem ipsum').jsonBody;
//     const valid = adminQuizDescriptionUpdate(adminId1.authUserId, quizId.quizId, 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?');

//     expect(valid).toStrictEqual({
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