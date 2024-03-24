import {
  clear,
  adminAuthRegister,
  adminQuizCreate,
  adminQuizRemove,
  adminQuizList,
} from './testHelpers';

beforeEach(() => {
  clear();
});

describe('adminQuizRemove', () => {
  test('Successful test', () => {
    const {jsonBody: {token}} = adminAuthRegister('nick@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const {jsonBody: {quizId}} = adminQuizCreate(token, 'Cities of Australia', 'good quiz');

    expect(adminQuizRemove(token, quizId)).toStrictEqual({
      jsonBody: {},
      statusCode: 200,
    });
  });

  test('authUserId is not a valid user', () => {
    const {jsonBody: {token}} = adminAuthRegister('nick@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const {jsonBody: {quizId}} = adminQuizCreate(token, 'Cities of Australia', 'good quiz');

    expect(adminQuizRemove(token.concat("hello"), quizId)).toStrictEqual({
      statusCode: 401,
      jsonBody: {error: expect.any(String)}
    });
  });

  test('QuizId is not a valid quiz.', () => {
    const {jsonBody: {token}} = adminAuthRegister('nick@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');

    expect(adminQuizRemove(token, 1234)).toStrictEqual({
      statusCode: 403,
      jsonBody: {error: expect.any(String)}
    });
  });

  test('Quiz ID does not refer to a quiz that this user owns.', () => {
    const {jsonBody: {token}} = adminAuthRegister('nick@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const token1 = adminAuthRegister('DunYao@gmail.com', 'DunYao1234', 'DunYao', 'Foo');
    const {jsonBody: {quizId}} = adminQuizCreate(token, 'Cities of Australia', 'good quiz'); // nick's quiz

    expect(adminQuizRemove(token1.jsonBody.token, quizId)).toStrictEqual({
      statusCode: 403,
      jsonBody: {error: expect.any(String)}
    });
  });

  test('Successful quiz remove - comprehensive test', () => {
    const userId = adminAuthRegister('nick@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const quiz = adminQuizCreate(userId.jsonBody.token, 'Cities of Australia', 'good quiz');

    expect(adminQuizList(userId.jsonBody.token)).toStrictEqual({
      statusCode: 200,
      jsonBody: {
        quizzes: [
          {
            quizId: quiz.jsonBody.quizId,
            name: 'Cities of Australia'
          }
        ]
      }
    });

    const quizToDelete = adminQuizCreate(userId.jsonBody.token, 'i will be gone soon', 'goodbye');

    expect(adminQuizList(userId.jsonBody.token)).toStrictEqual({
      statusCode: 200,
      jsonBody: {
        quizzes: [
          {
            quizId: quiz.jsonBody.quizId,
            name: 'Cities of Australia'
          },
          {
            quizId: quizToDelete.jsonBody.quizId,
            name: 'i will be gone soon'
          }
        ]
      }
    });

    expect(adminQuizRemove(userId.jsonBody.token, quizToDelete.jsonBody.quizId)).toStrictEqual({
      statusCode: 200,
      jsonBody: {}
     });

    expect(adminQuizList(userId.jsonBody.token)).toStrictEqual({
      statusCode: 200,
      jsonBody: {
        quizzes: [
          {
            quizId: quiz.jsonBody.quizId,
            name: 'Cities of Australia'
          }
        ]
      }
    });
  });
});

