import {
  clear,
  adminAuthRegister,
  adminQuizCreate,
  adminQuizRemove,
} from './testHelpers';

beforeEach(() => {
  clear();
});

describe('adminQuizRemove', () => {
  test('Successful test', () => {
    const {jsonBody: {authUserId}} = adminAuthRegister('nick@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const {jsonBody: {quizId}} = adminQuizCreate(authUserId, 'Cities of Australia', 'good quiz');

    expect(adminQuizRemove(authUserId, quizId)).toStrictEqual({
      jsonBody: {},
      statusCode: 200,
    });
  });

  test('authUserId is not a valid user', () => {
    const {jsonBody: {authUserId}} = adminAuthRegister('nick@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const {jsonBody: {quizId}} = adminQuizCreate(authUserId, 'Cities of Australia', 'good quiz');

    expect(adminQuizRemove(1234, quizId)).toStrictEqual({
      statusCode: 401,
      jsonBody: {error: expect.any(String)}
    });
  });

  test('QuizId is not a valid quiz.', () => {
    const {jsonBody: {authUserId}} = adminAuthRegister('nick@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');

    expect(adminQuizRemove(authUserId, 1234)).toStrictEqual({
      statusCode: 403,
      jsonBody: {error: expect.any(String)}
    });
  });

  test('Quiz ID does not refer to a quiz that this user owns.', () => {
    const {jsonBody: {authUserId}} = adminAuthRegister('nick@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const authUserId1 = adminAuthRegister('DunYao@gmail.com', 'DunYao1234', 'DunYao', 'Foo');
    const {jsonBody: {quizId}} = adminQuizCreate(authUserId, 'Cities of Australia', 'good quiz'); // nick's quiz

    expect(adminQuizRemove(authUserId1.jsonBody.authUserId, quizId)).toStrictEqual({
      statusCode: 403,
      jsonBody: {error: expect.any(String)}
    });
  });

  // commetning out because no adminQuizList

  /*
  test('Successful quiz remove - comprehensive test', () => {
    const userId = adminAuthRegister('nick@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const quiz = adminQuizCreate(userId.authUserId, 'Cities of Australia', 'good quiz');
    let quizList = adminQuizList(userId.authUserId);

    expect(quizList).toStrictEqual({
      quizzes: [
        {
          quizId: quiz.quizId,
          name: 'Cities of Australia'
        }
      ]
    });

    const quizToDelete = adminQuizCreate(userId.authUserId, 'i will be gone soon', 'goodbye');
    quizList = adminQuizList(userId.authUserId);

    expect(quizList).toStrictEqual({
      quizzes: [
        {
          quizId: quiz.quizId,
          name: 'Cities of Australia'
        },
        {
          quizId: quizToDelete.quizId,
          name: 'i will be gone soon'
        }
      ]
    });

    expect(adminQuizRemove(userId.authUserId, quizToDelete.quizId)).toStrictEqual({ });

    quizList = adminQuizList(userId.authUserId);

    expect(quizList).toStrictEqual({
      quizzes: [
        {
          quizId: quiz.quizId,
          name: 'Cities of Australia'
        }
      ]
    });
  });
  */
});
