// import {
//     adminQuizCreate,
//     adminQuizSessionStart,
//     //v2adminQuizRemove,
//   } from './v2testHelpers';
//   import {
//     clear,
//     adminAuthRegister
//   } from '../iteration2Tests/testHelpers';
//   import HTTPError from 'http-errors';

  
//   let token: string;
//   let quizId: number;
//   beforeEach(() => {
//     clear();
  
//     token = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian').token;
//     quizId = adminQuizCreate(token, 'QuizName', 'QuizDescription').quizId;
//   });
  
//     describe('adminQuizSessionStart', () => {
//     test('Successful test case', () => {
//       expect(adminQuizSessionStart(token, quizId, 3)).toStrictEqual({});
//     });
  
//     test('autoStartNum being greater than 50', () => {
//       expect(() => adminQuizSessionStart(token, quizId, 51)).toThrow(HTTPError[400]);
//     });
  
//     // adminQuizRemove currently being worked on.
//     // test('Quiz ID does not refer to a valid quiz.', () => {
//     //   adminQuizRemove(token, quizId);
//     //   expect(() => adminQuizSessionStart(token, quizId, 3)).toThrow(HTTPError[400]);
//     // });

//     // Need to make another one that uses question create, since quiz does not have any questions
//     // error
  

//   });
  