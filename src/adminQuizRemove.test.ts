import {
  clear,
  adminAuthRegister,
  adminQuizCreate,
  adminQuizRemove,
  adminQuizList,
} from './testHelpers';

let token: string;
let quizId: number;
beforeEach(() => {
  clear();

  token = adminAuthRegister('nick@gmail.com', 'nick1234', 'Nicholas', 'Sebastian').jsonBody.token;
  quizId = adminQuizCreate(token, 'Cities of Australia', 'good quiz').jsonBody.quizId;
});

describe('adminQuizRemove', () => {
  test('Successful test', () => {
    expect(adminQuizRemove(token, quizId)).toStrictEqual({
      jsonBody: {},
      statusCode: 200,
    });
  });

  test('authUserId is not a valid user', () => {
    expect(adminQuizRemove(token + 'hello', quizId)).toStrictEqual({
      statusCode: 401,
      jsonBody: { error: expect.any(String) }
    });
  });

  test('QuizId is not a valid quiz.', () => {
    expect(adminQuizRemove(token, 1234)).toStrictEqual({
      statusCode: 403,
      jsonBody: { error: expect.any(String) }
    });
  });

  test('Quiz ID does not refer to a quiz that this user owns.', () => {
    const token1 = adminAuthRegister('DunYao@gmail.com', 'DunYao1234', 'DunYao', 'Foo').jsonBody.token;

    expect(adminQuizRemove(token1, quizId)).toStrictEqual({
      statusCode: 403,
      jsonBody: { error: expect.any(String) }
    });
  });

  test('Successful quiz remove - comprehensive test', () => {
    expect(adminQuizList(token)).toStrictEqual({
      statusCode: 200,
      jsonBody: {
        quizzes: [
          {
            quizId: quizId,
            name: 'Cities of Australia'
          }
        ]
      }
    });

    const quizId2 = adminQuizCreate(token, 'i will be gone soon', 'goodbye').jsonBody.quizId;

    expect(adminQuizList(token)).toStrictEqual({
      statusCode: 200,
      jsonBody: {
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
      }
    });

    expect(adminQuizRemove(token, quizId2)).toStrictEqual({
      statusCode: 200,
      jsonBody: {}
    });

    expect(adminQuizList(token)).toStrictEqual({
      statusCode: 200,
      jsonBody: {
        quizzes: [
          {
            quizId: quizId,
            name: 'Cities of Australia'
          }
        ]
      }
    });
  });
});
