import {
  v2adminQuizCreate,
  v2adminQuizQuestionDelete,
  v2adminQuizQuestionCreate,
  v2adminQuizInfo,
} from './v2testHelpers';
import {
  clear,
  adminAuthRegister,
} from '../iteration2Tests/testHelpers';

import HTTPError from 'http-errors';
let token: string;
let quizId: number;
let questionId: number;
beforeEach(() => {
  clear();

  token = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh').token;
  quizId = v2adminQuizCreate(token, 'Australian Cities', 'lorem ipsum').quizId;
  questionId = v2adminQuizQuestionCreate(quizId, token, 'Question1', 5, 5, [{ answer: 'Melb', correct: true }, { answer: 'Syd', correct: false }],
    'https://www.unsw.edu.au/content/dam/images/photos/events/open-day/2020-12-homepage-update/OpenDay_2019_campaign%20-0307-crop.cropimg.width=1920.crop=square.jpg').questionId;
});

describe('Testing DELETE /v1/admin/quiz/:quizid/question/:questionid', () => {
  test('Comprehensive Test Successful: Successfully Deleting a Question from a Quiz, then Checking QuizInfo', () => {
    expect(v2adminQuizQuestionDelete(token, quizId, questionId)).toStrictEqual({

    });
    expect(v2adminQuizInfo(token, quizId).questions).toStrictEqual([]);
  });

  test('Test Successful: Successfully Deleted a Question from a Quiz', () => {
    expect(v2adminQuizQuestionDelete(token, quizId, questionId)).toStrictEqual({

    });
  });

  test('Test Unsuccessful: User is not an owner of the quiz', () => {
    const session2 = adminAuthRegister('glhfh@gmail.com', 'glhf123111', 'abcd', 'efgh');
    expect(() => v2adminQuizQuestionDelete(session2.token, quizId, questionId)).toThrow(HTTPError[403]);
  });

  test.each([
    [''],
    ['123123'],
  ])('Test Unsuccessful: Token Invalid', (token) => {
    expect(() => v2adminQuizQuestionDelete(token, quizId, questionId)).toThrow(HTTPError[401]);
  });

  test('Test Unsuccessful: Quiz Id Invalid', () => {
    expect(() => v2adminQuizQuestionDelete(token, -1000000000, questionId)).toThrow(HTTPError[403]);
  });

  test.each([
    [-1],
    [123123],
  ])('Test Unsuccessful: Invalid QuestionId', (questionId) => {
    expect(() => v2adminQuizQuestionDelete(token, quizId, questionId)).toThrow(HTTPError[400]);
  });

  test('Test Unsuccessful: Invalid QuizId', () => {
    expect(() => v2adminQuizQuestionDelete(token, -1, questionId)).toThrow(HTTPError[403]);
  });

  test('Test Unsuccessful: Quiz Not In End-State (UNIMPLEMENTED!)', () => {
    expect(1 + 1).toStrictEqual(2);
  });
});
