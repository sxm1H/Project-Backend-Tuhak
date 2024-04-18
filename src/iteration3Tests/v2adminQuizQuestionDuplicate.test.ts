import {
  v2adminQuizCreate,
  v2adminQuizInfo,
  v2adminQuizQuestionCreate,
  adminQuizQuestionDuplicate,
} from './v2testHelpers';
import {
  clear,
  adminAuthRegister,
} from '../iteration2Tests/testHelpers';

import HTTPError from 'http-errors';

const thumbnailUrl = 'https://www.unsw.edu.au/content/dam/images/photos/events/open-day/2020-12-homepage-update/OpenDay_2019_campaign%20-0307-crop.cropimg.width=1920.crop=square.jpg';
let token: string;
let quizId: number;
beforeEach(() => {
  clear();

  token = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh').token;
  quizId = v2adminQuizCreate(token, 'cool quiz', 'cool desc').quizId;
});

describe('Testing POST /v1/admin/quiz/:quizid/question/:questionid/duplicate', () => {
  test('Question successfully duplicated', () => {
    const questionId = v2adminQuizQuestionCreate(quizId, token, 'cool question', 4, 5, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], thumbnailUrl).questionId;

    expect(adminQuizQuestionDuplicate(token, quizId, questionId)).toStrictEqual({
      newQuestionId: expect.any(Number),
    });

    const updatedDate = Math.floor(Date.now() / 1000);
    const timeLastEdited = v2adminQuizInfo(token, quizId).timeLastEdited;
    expect(updatedDate).toBeGreaterThanOrEqual(timeLastEdited);
    expect(updatedDate).toBeLessThanOrEqual(timeLastEdited + 2);
  });

  test('Question Id does not refer to valid question', () => {
    expect(() => adminQuizQuestionDuplicate(token, quizId, 1)).toThrow(HTTPError[400]);
  });

  test('Quiz Id does not refer to existing quiz', () => {
    expect(() => adminQuizQuestionDuplicate(token, -100000000, 1)).toThrow(HTTPError[403]);
  });

  test('Token is invalid', () => {
    const questionId = v2adminQuizQuestionCreate(quizId, token, 'cool question', 4, 5, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], thumbnailUrl).questionId;

    expect(() => adminQuizQuestionDuplicate(token.concat('POG'), quizId, questionId)).toThrow(HTTPError[401]);
  });

  test('User is not owner of the quiz', () => {
    const token2 = adminAuthRegister('abcd@gmail.com', 'abcd1234', 'ahhhhh', 'hello').token;
    const questionId = v2adminQuizQuestionCreate(quizId, token, 'cool question', 4, 5, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], thumbnailUrl).questionId;

    expect(() => adminQuizQuestionDuplicate(token2, quizId, questionId)).toThrow(HTTPError[403]);
  });
});
