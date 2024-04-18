import {
  clear,
  adminAuthRegister,
} from '../iteration2Tests/testHelpers';
import {
  v2adminQuizCreate,
  adminQuizQuestionMove,
  v2adminQuizQuestionCreate,
} from './v2testHelpers';

import HTTPError from 'http-errors';

let token: string;
let quizId: number;
let thumbnailUrl: string;
beforeEach(() => {
  clear();

  token = adminAuthRegister('pain@gmail.com', 'Wowowowow123', 'Alex', 'Hirsch').token;
  quizId = v2adminQuizCreate(token, 'cool name', 'cool description').quizId;
  thumbnailUrl = 'https://www.unsw.edu.au/content/dam/images/photos/events/open-day/2020-12-homepage-update/OpenDay_2019_campaign%20-0307-crop.cropimg.width=1920.crop=square.jpg';
});

describe('Testing PUT /v1/admin/quiz/{quizid}/question/{questionid}/move', () => {
  test('Successful question move', () => {
    const questionId = v2adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }], thumbnailUrl).questionId;
    v2adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }], thumbnailUrl);
    expect(adminQuizQuestionMove(quizId, questionId, token, 1)).toStrictEqual({});
  });

  test('Question Id is does not refer to valid question', () => {
    expect(() => adminQuizQuestionMove(quizId, 10, token, 1)).toThrow(HTTPError[400]);
  });

  test('New Position is less than 0', () => {
    const questionId = v2adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }], thumbnailUrl).questionId;
    expect(() => adminQuizQuestionMove(quizId, questionId, token, -1)).toThrow(HTTPError[400]);
  });

  test('New Position is more than number of questions', () => {
    const questionId = v2adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }], thumbnailUrl).questionId;
    expect(() => adminQuizQuestionMove(quizId, questionId, token, 2)).toThrow(HTTPError[400]);
  });

  test('New Position is the same position', () => {
    const questionId = v2adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }], thumbnailUrl).questionId;
    expect(() => adminQuizQuestionMove(quizId, questionId, token, 0)).toThrow(HTTPError[400]);
  });

  test('Token is invalid', () => {
    const quest1 = v2adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }], thumbnailUrl);
    v2adminQuizQuestionCreate(quizId, token, 'cool question', 5, 4, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }], thumbnailUrl);
    expect(() => adminQuizQuestionMove(quizId, quest1.questionId, token + 'POGGERS', 1)).toThrow(HTTPError[401]);
  });

  test('User does not own quiz', () => {
    const token2 = adminAuthRegister('pogchamp@gmail.com', 'thisisvalidpassword1', 'Steve', 'Jobs').token;
    const quizId2 = v2adminQuizCreate(token2, 'cool name', 'cool description').quizId;
    const questionId = v2adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }], thumbnailUrl).questionId;
    v2adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }], thumbnailUrl);
    expect(() => adminQuizQuestionMove(quizId2, questionId, token, 1)).toThrow(HTTPError[403]);
  });

  test('Test Unsuccessful: Invalid Quiz Id', () => {
    const questionId = v2adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }], thumbnailUrl).questionId;
    expect(() => adminQuizQuestionMove(-1, questionId, token, 1)).toThrow(HTTPError[403]);
  });
});
