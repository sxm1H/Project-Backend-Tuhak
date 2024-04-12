import {
  clear,
  adminAuthRegister,
  adminQuizCreate,
  adminQuizInfo,
} from './testHelpersIter2';

let token: string;
let quizId: number;
let time: number;

import HTTPError from 'http-errors';

beforeEach(() => {
  clear();

  token = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo').token;
  quizId = adminQuizCreate(token, 'quiz1', 'lorem ipsum').quizId;

  time = Math.floor(Date.now() / 1000);
});

describe('Testing GET /v1/admin/quiz/:quizid', () => {
  test('Successfully retrieves info', () => {

    const info = adminQuizInfo(token, quizId);

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
        numQuestions: 0
    });
  });

  test('Invalid token', () => {
    expect(() => adminQuizInfo('hello', quizId)).toThrow(HTTPError[401]);
  });

  test('Invalid quizId)', () => {
    expect(() => adminQuizInfo(token, -2)).toThrow(HTTPError[400]);
  });

  test('User does not own quiz', () => {
    expect(() => adminAuthRegister('sami@unsw.edu.au', '1234abcd', 'Sami', 'Hossain')).toThrow(HTTPError[403]);
  });
});
