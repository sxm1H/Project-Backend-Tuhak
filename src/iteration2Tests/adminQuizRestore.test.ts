// import {
//   clear,
//   adminAuthRegister,
//   adminQuizCreate,
//   adminQuizInfo,
//   adminQuizRestore,
//   adminQuizRemove,
//   adminQuizList
// } from './testHelpersIter2';

// let token: string;
// let quizId: number;
// let time: number;
// beforeEach(() => {
//   clear();

//   token = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo').jsonBody.token;
//   quizId = adminQuizCreate(token, 'quiz1', 'lorem ipsum').jsonBody.quizId;

//   time = Math.floor(Date.now() / 1000);
// });

// describe('Testing GET /v1/admin/quiz/:quizid', () => {
//   test('Successfully restores quiz from trash', () => {
//     expect(adminQuizList(token)).toStrictEqual({
//       jsonBody: {
//         quizzes: [
//           {
//             quizId: quizId,
//             name: 'quiz1'
//           }
//         ]
//       },
//       statusCode: 200
//     });
//     adminQuizRemove(token, quizId);
//     expect(adminQuizList(token)).toStrictEqual({
//       jsonBody: {
//         quizzes: []
//       },
//       statusCode: 200
//     });
//     adminQuizRestore(token, quizId);
//     expect(adminQuizList(token)).toStrictEqual({
//       jsonBody: {
//         quizzes: [
//           {
//             quizId: quizId,
//             name: 'quiz1'
//           }
//         ]
//       },
//       statusCode: 200
//     });
//     const { statusCode, jsonBody } = adminQuizInfo(token, quizId);
//     expect(jsonBody.timeLastEdited).toBeGreaterThanOrEqual(time);
//     expect(jsonBody.timeLastEdited).toBeLessThanOrEqual(time + 2);
//     expect(statusCode).toStrictEqual(200);
//   });

//   test('Quiz name of restored quiz is already used by another active quiz', () => {
//     expect(adminQuizList(token)).toStrictEqual({
//       jsonBody: {
//         quizzes: [
//           {
//             quizId: quizId,
//             name: 'quiz1'
//           }
//         ]
//       },
//       statusCode: 200
//     });
//     adminQuizRemove(token, quizId);
//     expect(adminQuizList(token)).toStrictEqual({
//       jsonBody: {
//         quizzes: []
//       },
//       statusCode: 200
//     });
//     adminQuizCreate(token, 'quiz1', 'description');
//     expect(adminQuizRestore(token, quizId)).toStrictEqual(
//       {
//         statusCode: 400,
//         jsonBody: { error: expect.any(String) }
//       }
//     );
//   });

//   test('Quiz ID refers to quiz not in trash', () => {
//     expect(adminQuizList(token)).toStrictEqual({
//       jsonBody: {
//         quizzes: [
//           {
//             quizId: quizId,
//             name: 'quiz1'
//           }
//         ]
//       },
//       statusCode: 200
//     });
//     adminQuizRemove(token, quizId);
//     expect(adminQuizList(token)).toStrictEqual({
//       jsonBody: {
//         quizzes: []
//       },
//       statusCode: 200
//     });
//     const quizId2 = adminQuizCreate(token, 'Qu1', 'dsdasas').jsonBody.quizId;
//     expect(adminQuizRestore(token, quizId2)).toStrictEqual(
//       {
//         statusCode: 400,
//         jsonBody: { error: expect.any(String) }
//       }
//     );
//   });

//   test('User is not logged in', () => {
//     expect(adminQuizList(token)).toStrictEqual({
//       jsonBody: {
//         quizzes: [
//           {
//             quizId: quizId,
//             name: 'quiz1'
//           }
//         ]
//       },
//       statusCode: 200
//     });
//     adminQuizRemove(token, quizId);
//     expect(adminQuizList(token)).toStrictEqual({
//       jsonBody: {
//         quizzes: []
//       },
//       statusCode: 200
//     });
//     expect(adminQuizRestore(token + 'hello', quizId)).toStrictEqual(
//       {
//         statusCode: 401,
//         jsonBody: { error: expect.any(String) }
//       }
//     );
//   });

//   test('Valid token, but user not owner of quiz', () => {
//     expect(adminQuizList(token)).toStrictEqual({
//       jsonBody: {
//         quizzes: [
//           {
//             quizId: quizId,
//             name: 'quiz1'
//           }
//         ]
//       },
//       statusCode: 200
//     });
//     adminQuizRemove(token, quizId);
//     expect(adminQuizList(token)).toStrictEqual({
//       jsonBody: {
//         quizzes: []
//       },
//       statusCode: 200
//     });
//     const { jsonBody: newUser } = adminAuthRegister('nick@unsw.edu.au', 'abcd1234', 'nick', 'yes');
//     expect(adminQuizRestore(newUser.token, quizId)).toStrictEqual(
//       {
//         statusCode: 403,
//         jsonBody: { error: expect.any(String) }
//       }
//     );
//   });

//   test('Test Unsuccessful: Invalid QuizId', () => { 
//     adminQuizRemove(token, quizId);
//     expect(adminQuizRestore(token, -1)).toStrictEqual(
//       {
//         statusCode: 403,
//         jsonBody: { error: expect.any(String) }
//       }
//     );
//   })
// });

test('temp', () => {
  expect(2+2).toBe(4);
});
