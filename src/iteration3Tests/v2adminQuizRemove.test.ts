import {
  clear,
  adminAuthRegister,
  adminQuizList,
} from '../iteration2Tests/testHelpers';
import {
  v2adminQuizCreate,
  v2adminQuizRemove,
  adminQuizSessionCreate,
  adminQuizSessionUpdate,
  v2adminQuizQuestionCreate
} from './v2testHelpers';
import HTTPError from 'http-errors';

const thumbnail = 'https://www.unsw.edu.au/content/dam/images/photos/events/open-day/2020-12-homepage-update/OpenDay_2019_campaign%20-0307-crop.cropimg.width=1920.crop=square.jpg';
let token: string;
let quizId: number;
beforeEach(() => {
  clear();

  token = adminAuthRegister('nick@gmail.com', 'nick1234', 'Nicholas', 'Sebastian').token;
  quizId = v2adminQuizCreate(token, 'Cities of Australia', 'good quiz').quizId;
  v2adminQuizQuestionCreate(quizId, token, 'question1', 5, 4,
    [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], thumbnail);
});

describe('v2adminQuizRemove', () => {
  test('Successful test', () => {
    expect(v2adminQuizRemove(token, quizId)).toStrictEqual({});

    quizId = v2adminQuizCreate(token, 'Cities of Australia', 'good quiz').quizId;
    v2adminQuizQuestionCreate(quizId, token, 'question1', 5, 4,
      [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], thumbnail);

    const sessionId = adminQuizSessionCreate(token, quizId, 4).sessionId;
    adminQuizSessionUpdate(token, quizId, sessionId, 'END');

    expect(v2adminQuizRemove(token, quizId)).toStrictEqual({});
  });

  test('authUserId is not a valid user', () => {
    expect(() => v2adminQuizRemove(token + 'hello', quizId)).toThrow(HTTPError[401]);
  });

  test('QuizId is not a valid quiz.', () => {
    expect(() => v2adminQuizRemove(token, 1234)).toThrow(HTTPError[403]);
  });

  test('Quiz ID does not refer to a quiz that this user owns.', () => {
    const token1 = adminAuthRegister('DunYao@gmail.com', 'DunYao1234', 'DunYao', 'Foo').token;

    expect(() => v2adminQuizRemove(token1, quizId)).toThrow(HTTPError[403]);
  });

  test('Successful quiz remove - comprehensive test', () => {
    expect(adminQuizList(token)).toStrictEqual({
      quizzes: [
        {
          quizId: quizId,
          name: 'Cities of Australia'
        }
      ]
    });

    const quizId2 = v2adminQuizCreate(token, 'i will be gone soon', 'goodbye').quizId;

    expect(adminQuizList(token)).toStrictEqual({
      quizzes: [
        {
          quizId: quizId,
          name: 'Cities of Australia'
        },
        {
          quizId: quizId2,
          name: 'i will be gone soon'
        }
      ]
    });

    expect(v2adminQuizRemove(token, quizId2)).toStrictEqual({});

    expect(adminQuizList(token)).toStrictEqual({
      quizzes: [
        {
          quizId: quizId,
          name: 'Cities of Australia'
        }
      ]
    });
  });

  test('Test Unsuccessful: Invalid Quiz Id', () => {
    expect(() => v2adminQuizRemove(token, -1)).toThrow(HTTPError[403]);
  });

  test('Quiz is not in END state', () => {
    adminQuizSessionCreate(token, quizId, 5);

    expect(() => v2adminQuizRemove(token, quizId)).toThrow(HTTPError[400]);
  });
});
