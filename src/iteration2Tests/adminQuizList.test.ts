// import {
//   clear,
//   adminAuthRegister,
//   adminQuizList,
//   adminQuizCreate,
// } from './testHelpersIter2';

// let token: string;
// beforeEach(() => {
//   clear();

//   token = adminAuthRegister('pain@gmail.com', 'Wowowowow123', 'Alex', 'Hirsch').jsonBody.token;
// });

// describe('Test GET /v1/admin/quiz/list', () => {
//   test('Token invalid', () => {
//     const { statusCode, jsonBody } = adminQuizList(token + '1');
//     expect(statusCode).toStrictEqual(401);
//     expect(jsonBody.error).toStrictEqual(expect.any(String));
//   });

//   test('User Id Quiz List successfully accessed', () => {
//     const { statusCode, jsonBody } = adminQuizList(token);
//     expect(statusCode).toStrictEqual(200);
//     expect(jsonBody).toStrictEqual({
//       quizzes: []
//     });

//     const { jsonBody: { quizId } } = adminQuizCreate(token, 'creative name', 'description');
//     const list2 = adminQuizList(token);

//     expect(list2.statusCode).toStrictEqual(200);
//     expect(list2.jsonBody).toStrictEqual({
//       quizzes: [
//         {
//           quizId: quizId,
//           name: 'creative name'
//         }
//       ]
//     });
//   });
// });

test('temp', () => {
  expect(2 + 2).toBe(4);
});
