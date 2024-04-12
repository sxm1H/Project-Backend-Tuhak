// import {
//   clear,
//   adminQuizTrashEmpty,
//   adminQuizRemove,
//   adminAuthRegister,
//   adminQuizCreate,
//   adminQuizList,
// } from './testHelpersIter2';

// let token: string;
// let quizId: number;
// beforeEach(() => {
//   clear();

//   const { jsonBody: reg } = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
//   const { jsonBody: create } = adminQuizCreate(reg.token, 'quiz1', 'lorem ipsum');

//   token = reg.token;
//   quizId = create.quizId;
// });

// describe('Testing DELETE /v1/admin/quiz/trash/empty', () => {
//   test('Successfully emptys trash', () => {
//     expect(adminQuizList(token)).toStrictEqual({
//       statusCode: 200,
//       jsonBody: {
//         quizzes: [
//           {
//             quizId: quizId,
//             name: 'quiz1'
//           }
//         ]
//       }
//     });
//     adminQuizRemove(token, quizId);
//     expect(adminQuizList(token)).toStrictEqual({
//       statusCode: 200,
//       jsonBody: {
//         quizzes: []
//       }
//     });

//     const stringArray = `[${quizId}]`;

//     expect(adminQuizTrashEmpty(token, stringArray)).toStrictEqual({
//       statusCode: 200,
//       jsonBody: {},
//     });
//   });

//   test('Invalid token', () => {
//     expect(adminQuizList(token)).toStrictEqual({
//       statusCode: 200,
//       jsonBody: {
//         quizzes: [
//           {
//             quizId: quizId,
//             name: 'quiz1'
//           }
//         ]
//       }
//     });
//     adminQuizRemove(token, quizId);
//     expect(adminQuizList(token)).toStrictEqual({
//       statusCode: 200,
//       jsonBody: {
//         quizzes: []
//       }
//     });

//     const stringArray = `[${quizId}]`;

//     expect(adminQuizTrashEmpty(token + 'hello', stringArray)).toStrictEqual({
//       statusCode: 401,
//       jsonBody: {
//         error: expect.any(String)
//       }
//     });
//   });

//   test('Quiz not in trash', () => {
//     expect(adminQuizList(token)).toStrictEqual({
//       statusCode: 200,
//       jsonBody: {
//         quizzes: [
//           {
//             quizId: quizId,
//             name: 'quiz1'
//           }
//         ]
//       }
//     });
//     adminQuizRemove(token, quizId);
//     expect(adminQuizList(token)).toStrictEqual({
//       statusCode: 200,
//       jsonBody: {
//         quizzes: []
//       }
//     });

//     const { jsonBody: create } = adminQuizCreate(token, 'quiz2', 'lorem ipsum');

//     const stringArray = `[${quizId}, ${create.quizId}]`;

//     expect(adminQuizTrashEmpty(token, stringArray)).toStrictEqual({
//       statusCode: 400,
//       jsonBody: {
//         error: expect.any(String)
//       },
//     });
//   });

//   test('Quiz does not belong to user, but is in trash', () => {
//     expect(adminQuizList(token)).toStrictEqual({
//       statusCode: 200,
//       jsonBody: {
//         quizzes: [
//           {
//             quizId: quizId,
//             name: 'quiz1'
//           }
//         ]
//       }
//     });
//     adminQuizRemove(token, quizId);
//     expect(adminQuizList(token)).toStrictEqual({
//       statusCode: 200,
//       jsonBody: {
//         quizzes: []
//       }
//     });

//     const { jsonBody: newUser } = adminAuthRegister('nick@unsw.edu.au', 'nick1234', 'nicholas', 'sebastian');
//     const { jsonBody: create } = adminQuizCreate(newUser.token, 'quiz2', 'lorem ipsum');
//     adminQuizRemove(newUser.token, create.quizId);

//     const stringArray = `[${quizId}, ${create.quizId}]`;

//     expect(adminQuizTrashEmpty(token, stringArray)).toStrictEqual({
//       statusCode: 403,
//       jsonBody: {
//         error: expect.any(String)
//       },
//     });
//   });

//   test('Test Unsuccessful: Invalid QuizId', () => {
//     adminQuizRemove(token, quizId);
//     const stringArray = `[${-1}]`;
//     expect(adminQuizTrashEmpty(token, stringArray)).toStrictEqual({
//       statusCode: 403,
//       jsonBody: {
//         error: expect.any(String)
//       },
//     });
//   });
// });

test('temp', () => {
  expect(2 + 2).toBe(4);
});
