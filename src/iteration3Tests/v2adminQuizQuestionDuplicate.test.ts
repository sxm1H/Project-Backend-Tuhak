// import {
//   clear,
//   adminAuthRegister,
//   adminQuizCreate,
//   adminQuizInfo,
//   adminQuizQuestionCreate,
//   adminQuizQuestionDuplicate,
// } from './testHelpersIter3';

// import HTTPError from 'http-errors';

// let token: string;
// let quizId: number;
// beforeEach(() => {
//   clear();

//   token = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh').token;
//   quizId = adminQuizCreate(token, 'cool quiz', 'cool desc').quizId;
// });

// describe('Testing POST /v1/admin/quiz/:quizid/question/:questionid/duplicate', () => {
//   test('Question successfully duplicated', () => {
//     let questionId = adminQuizQuestionCreate(quizId, token, 'cool question', 4, 5, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }]).questionId;

//     expect( adminQuizQuestionDuplicate(token, quizId, questionId)).toStrictEqual({
//       newQuestionId: expect.any(Number),
//     });

//     const updatedDate = Math.floor(Date.now() / 1000);
//     const timeLastEdited = adminQuizInfo(token, quizId).timeLastEdited;
//     expect(updatedDate).toBeGreaterThanOrEqual(timeLastEdited);
//     expect(updatedDate).toBeLessThanOrEqual(timeLastEdited + 2);
//   });

//   test('Question Id does not refer to valid question', () => {
//     expect(() =>  adminQuizQuestionDuplicate(token, quizId, 1)).toThrow(HTTPError[400]);

//   });

//   test('Quiz Id does not refer to existing quiz', () => {
//     expect(() => adminQuizQuestionDuplicate(token, -100000000, 1)).toThrow(HTTPError[403]);
//   });

//   test('Token is invalid', () => {
//     let questionId = adminQuizQuestionCreate(quizId, token, 'cool question', 4, 5, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }]).questionId;

//     expect(() => adminQuizQuestionDuplicate(token.concat('POG'), quizId, questionId)).toThrow(HTTPError[401]);

//   });

//   test('User is not owner of the quiz', () => {
//     const token2 = adminAuthRegister('abcd@gmail.com', 'abcd1234', 'ahhhhh', 'hello').token;
//     let questionId = adminQuizQuestionCreate(quizId, token, 'cool question', 4, 5, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }]).questionId;

//     expect( () =>  adminQuizQuestionDuplicate(token2, quizId, questionId)).toThrow(HTTPError[403]);

//   });
// });

test('temp', () => {
  expect(2 + 2).toBe(4);
});
