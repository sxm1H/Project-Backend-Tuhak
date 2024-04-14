import {
  clear,
  adminAuthRegister,
  adminQuizCreate,
  adminQuizQuestionMove,
  adminQuizQuestionCreate,
} from './testHelpers';

import HTTPError from 'http-errors';

let token: string;
let quizId: number;
beforeEach(() => {
  clear();

  token = adminAuthRegister('pain@gmail.com', 'Wowowowow123', 'Alex', 'Hirsch').token;
  quizId = adminQuizCreate(token, 'cool name', 'cool description').quizId;
});

describe('Testing PUT /v1/admin/quiz/{quizid}/question/{questionid}/move', () => {
  test('Successful question move', () => {
    const questionId = adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }]).questionId;
    adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }]);
    expect(adminQuizQuestionMove(quizId, questionId, token, 1)).toStrictEqual({})
  });

  test('Question Id is does not refer to valid question', () => {
    expect(() => adminQuizQuestionMove(quizId, 10, token, 1)).toThrow(HTTPError[400])
  });

  test('New Position is less than 0', () => {
    const questionId = adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }]).questionId;
    expect(() => adminQuizQuestionMove(quizId, questionId, token, -1)).toThrow(HTTPError[400]);
  });

  test('New Position is more than number of questions', () => {
    const questionId = adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }]).questionId;
    expect(() => adminQuizQuestionMove(quizId, questionId, token, 2)).toThrow(HTTPError[400]);
  });

  test('New Position is the same position', () => {
    const questionId = adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }]).questionId;
    expect(() => adminQuizQuestionMove(quizId, questionId, token, 0)).toThrow(HTTPError[400]);
  });

  test('Token is invalid', () => {
    const quest1 = adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }]);
    adminQuizQuestionCreate(quizId, token, 'cool question', 5, 4, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }]);
    expect(() => adminQuizQuestionMove(quizId, quest1.questionId, token + 'POGGERS', 1)).toThrow(HTTPError[401]);
  });

  test('User does not own quiz', () => {
    const token2 = adminAuthRegister('pogchamp@gmail.com', 'thisisvalidpassword1', 'Steve', 'Jobs').token;
    const quizId2 = adminQuizCreate(token2, 'cool name', 'cool description').quizId;
    const questionId = adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }]).questionId;
    adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }]);
    expect(() => adminQuizQuestionMove(quizId2, questionId, token, 1)).toThrow(HTTPError[403]);
  });

  test('Test Unsuccessful: Invalid Quiz Id', () => {
    const questionId = adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }]).questionId;
    expect(() => adminQuizQuestionMove(-1, questionId, token, 1)).toThrow(HTTPError[403]);
  });
});
