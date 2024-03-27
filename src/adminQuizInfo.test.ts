import {
  clear,
  adminAuthRegister,
  adminQuizCreate,
  adminQuizInfo,
} from './testHelpers';

beforeEach(() => {
  clear();
});

describe('Testing GET /v1/admin/quiz/:quizid', () => {
  let token: string;
  let quizId: number;
  let time: number;
  beforeEach(() => {
    const { jsonBody: reg } = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
    const { jsonBody: create } = adminQuizCreate(reg.token, 'quiz1', 'lorem ipsum');

    token = reg.token;
    quizId = create.quizId;
    time = Math.floor(Date.now() / 1000);
  });

  test('Successfully retrieves info', () => {
    const { statusCode, jsonBody } = adminQuizInfo(token, quizId);

    expect(jsonBody.timeCreated).toBeGreaterThanOrEqual(time);
    expect(jsonBody.timeCreated).toBeLessThan(time + 1);
    expect(jsonBody.timeLastEdited).toBeGreaterThanOrEqual(time);
    expect(jsonBody.timeLastEdited).toBeLessThan(time + 1);

    expect(statusCode).toStrictEqual(200);
    expect(jsonBody).toStrictEqual(
      {
        quizId: expect.any(Number),
        name: expect.any(String),
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: expect.any(String),
        duration: expect.any(Number),
        questions: [],
        numQuestions: 0
      }
    );
  });

  test('Invalid token', () => {
    expect(adminQuizInfo('hello', quizId)).toStrictEqual(
      {
        statusCode: 401,
        jsonBody: { error: expect.any(String) }
      }
    );
  });

  test('Invalid quizId)', () => {
    expect(adminQuizInfo(token, -2)).toStrictEqual(
      {
        statusCode: 400,
        jsonBody: { error: expect.any(String) }
      }
    );
  });

  test('User does not own quiz', () => {
    const { jsonBody: { token: token2 } } = adminAuthRegister('sami@unsw.edu.au', '1234abcd', 'Sami', 'Hossain');
    expect(adminQuizInfo(token2, quizId)).toStrictEqual(
      {
        statusCode: 403,
        jsonBody: { error: expect.any(String) }
      }
    );
  });
});
