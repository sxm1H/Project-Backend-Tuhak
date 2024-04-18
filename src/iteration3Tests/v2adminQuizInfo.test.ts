
import {
  clear,
  adminAuthRegister,
} from '../iteration2Tests/testHelpers';
import {
  v2adminQuizInfo,
  v2adminQuizCreate,
} from './v2testHelpers';
import HTTPError from 'http-errors';

let token: string;
let quizId: number;
let time: number;
beforeEach(() => {
  clear();

  token = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo').token;
  quizId = v2adminQuizCreate(token, 'quiz1', 'lorem ipsum').quizId;
  time = Math.floor(Date.now() / 1000);
});

describe('Testing GET /v1/admin/quiz/:quizid', () => {
  test('Successfully retrieves info', () => {
    const info = v2adminQuizInfo(token, quizId);

    expect(info.timeCreated).toBeGreaterThanOrEqual(time);
    expect(info.timeCreated).toBeLessThanOrEqual(time + 2);
    expect(info.timeLastEdited).toBeGreaterThanOrEqual(time);
    expect(info.timeLastEdited).toBeLessThanOrEqual(time + 2);

    expect(info).toStrictEqual({
      quizId: expect.any(Number),
      name: expect.any(String),
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: expect.any(String),
      duration: expect.any(Number),
      questions: [],
      numQuestions: 0,
      thumbnailUrl: expect.any(String),
    });
  });

  test('Invalid token', () => {
    expect(() => v2adminQuizInfo('hello', quizId)).toThrow(HTTPError[401]);
  });

  test('Invalid quizId', () => {
    expect(() => v2adminQuizInfo(token, -2)).toThrow(HTTPError[403]);
  });

  test('User does not own quiz', () => {
    const token2 = adminAuthRegister('sami@unsw.edu.au', '1234abcd', 'Sami', 'Hossain').token;
    expect(() => v2adminQuizInfo(token2, quizId)).toThrow(HTTPError[403]);
  });
});

test('temp', () => {
  expect(2 + 2).toBe(4);
});
