// import { Http2ServerRequest } from 'http2';
// import {
//   clear,
//   adminAuthRegister,
//   adminQuizCreate,
//   adminQuizNameUpdate,
//   adminQuizList,
// } from './testHelpersIter2';

// import HTTPError from 'http-errors';

// let token: string;
// let quizId: number;
// beforeEach(() => {
//   clear();

//   token = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian').jsonBody.token;
//   quizId = adminQuizCreate(token, 'QuizName', 'QuizDescription').jsonBody.quizId;
// });

// describe('adminQuizNameUpdate', () => {
//   test('Successful test case', () => {
//     expect(adminQuizNameUpdate(token, quizId, 'newName')).toStrictEqual({});
//   });

//   test('Comprehensive successful test case', () => {
//     let quizList = adminQuizList(token);
//     expect(quizList).toStrictEqual({
//       quizId: quizId,
//       name: 'QuizName'
//     });

//     const quizId2 = adminQuizCreate(token, 'new quiz hello', 'hihihihi').jsonBody.quizId;

//     expect(adminQuizNameUpdate(token, quizId, 'newName')).toStrictEqual({});
//     quizList = adminQuizList(token);
//     expect(quizList).toStrictEqual({
//       quizzes: [
//         {
//           quizId: quizId,
//           name: 'newName'
//         },
//         {
//           quizId: quizId2,
//           name: 'new quiz hello'
//         }
//       ]
//     });

//     expect(adminQuizNameUpdate(token, quizId2, 'omg new name')).toStrictEqual({});

//     quizList = adminQuizList(token);
//     expect(quizList).toStrictEqual({
//       quizzes: [
//         {
//           quizId: quizId,
//           name: 'newName'
//         },
//         {
//           quizId: quizId2,
//           name: 'omg new name'
//         }
//       ]
//     });
//   });

//   test('Token session is not a valid user', () => {
//     // 1234 being not a valid authUserId
//     expect(() => adminQuizNameUpdate(token + 'hello', quizId, 'newName')).toThrow(HTTPError[401]);
//   });

//   test('Quiz ID does not refer to a valid quiz.', () => {
//     // 1234 being not a valid quizId
//     expect(() => adminQuizNameUpdate(token, quizId + 1, 'newName')).toThrow(HTTPError[403]);
//   });

//   test('Quiz ID does not refer to a quiz that this user owns.', () => {
//     const token2 = adminAuthRegister('dunyao1234@gmail.com', 'DunYao1234', 'DunYao', 'Foooooooooo').token;
//     expect(() => adminQuizNameUpdate(token2, quizId, 'newName')).toThrow(HTTPError[403])
//   });

//   test('Name contains invalid characters. Valid characters are alphanumeric and spaces.', () => {
//     // 🚫 is an emoji, therefore a invalid character
//     expect(() => adminQuizNameUpdate(token, quizId, '🚫')).toThrow(HTTPError[400]);
//   });

//   test('Name is either less than 3 characters long or more than 30 characters long.', () => {
//     // bb is two characters, therefore a invalid character
//     expect(() => adminQuizNameUpdate(token, quizId, 'bb')).toThrow(HTTPError[400]);
//   });

//   test('Name is either less than 3 characters long or more than 30 characters long.', () => {
//     // bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb is 31 characters, therefore a invalid name
//     expect(() => adminQuizNameUpdate(token, quizId, 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')).toThrow(HTTPError[400]);
//   });

//   test('Name is already used by the current logged in user for another quiz.', () => {
//     adminQuizCreate(token, 'duplicateName', 'quizDuplicateDescription');
//     adminQuizNameUpdate(token, quizId, 'duplicateName');
//     // duplicateName is already used
//     expect(() => adminQuizNameUpdate(token, quizId, 'duplicateName')).toThrow(HTTPError[400]);
//   });
// });

test('temp', () => {
  expect(2 + 2).toBe(4);
<<<<<<< HEAD
});
=======
});
>>>>>>> 5bf0826c9ea057c387ef4fddfb021fc93acc5761
