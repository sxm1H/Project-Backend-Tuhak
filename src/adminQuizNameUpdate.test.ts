import {
  clear,
  adminAuthRegister,
  adminQuizCreate,
  adminQuizNameUpdate,
  adminQuizList,
} from './testHelpers';

beforeEach(() => {
  clear();
});

describe('adminQuizNameUpdate', () => {
  test('Successful test case', () => {
    const user = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const quiz = adminQuizCreate(user.jsonBody.token, 'QuizName', 'QuizDescription');

    expect(adminQuizNameUpdate(user.jsonBody.token, quiz.jsonBody.quizId, 'newName')).toStrictEqual({
      statusCode: 200,
      jsonBody: {}
    });
  });

  test('Comprehensive successful test case', () => {
    const user = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const quiz = adminQuizCreate(user.jsonBody.token, 'QuizName', 'QuizDescription');
    let quizList = adminQuizList(user.jsonBody.token);

    expect(quizList).toStrictEqual({
      jsonBody: {
        quizzes: [
          {
            quizId: quiz.jsonBody.quizId,
            name: 'QuizName'
          }
        ]
      },
      statusCode: 200
    });

    const quiz2 = adminQuizCreate(user.jsonBody.token, 'new quiz hello', 'hihihihi');

    expect(adminQuizNameUpdate(user.jsonBody.token, quiz.jsonBody.quizId, 'newName')).toStrictEqual({
      jsonBody: {},
      statusCode: 200
    });
    quizList = adminQuizList(user.jsonBody.token);
    expect(quizList).toStrictEqual({
      jsonBody: {
        quizzes: [
          {
            quizId: quiz.jsonBody.quizId,
            name: 'newName'
          },
          {
            quizId: quiz2.jsonBody.quizId,
            name: 'new quiz hello'
          }
        ]
      },
      statusCode: 200
    });

    expect(adminQuizNameUpdate(user.jsonBody.token, quiz2.jsonBody.quizId, 'omg new name')).toStrictEqual({
      jsonBody: {},
      statusCode: 200
    });
    quizList = adminQuizList(user.jsonBody.token);
    expect(quizList).toStrictEqual({
      jsonBody: {
        quizzes: [
          {
            quizId: quiz.jsonBody.quizId,
            name: 'newName'
          },
          {
            quizId: quiz2.jsonBody.quizId,
            name: 'omg new name'
          }
        ]
      },
      statusCode: 200
    });
  });

  test('Token session is not a valid user', () => {
    const user = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const quiz = adminQuizCreate(user.jsonBody.token, 'QuizName', 'QuizDescription');

    // 1234 being not a valid authUserId
    expect(adminQuizNameUpdate(user.jsonBody.token + 'hello', quiz.jsonBody.quizId, 'newName')).toEqual({
      statusCode: 401,
      jsonBody: {
        error: expect.any(String)
      }
    });
  });

  test('Quiz ID does not refer to a valid quiz.', () => {
    const user = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const quiz = adminQuizCreate(user.jsonBody.token, 'QuizName', 'QuizDescription');

    // 1234 being not a valid quizId
    expect(adminQuizNameUpdate(user.jsonBody.token, quiz.jsonBody.quizId + 1, 'newName')).toEqual({
      statusCode: 403,
      jsonBody: {
        error: expect.any(String)
      }
    });
  });

  test('Quiz ID does not refer to a quiz that this user owns.', () => {
    const user1 = adminAuthRegister('dunyao1234@gmail.com', 'DunYao1234', 'DunYao', 'Foooooooooo');
    const user = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const quiz = adminQuizCreate(user1.jsonBody.token, 'QuizName', 'QuizDescription');

    expect(adminQuizNameUpdate(user.jsonBody.token, quiz.jsonBody.quizId, 'newName')).toEqual({
      statusCode: 403,
      jsonBody: {
        error: expect.any(String)
      }
    });
  });

  test('Name contains invalid characters. Valid characters are alphanumeric and spaces.', () => {
    const user = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const quiz = adminQuizCreate(user.jsonBody.token, 'QuizName', 'QuizDescription');

    // 🚫 is an emoji, therefore a invalid character
    expect(adminQuizNameUpdate(user.jsonBody.token, quiz.jsonBody.quizId, '🚫')).toEqual({
      statusCode: 400,
      jsonBody: {
        error: expect.any(String)
      }
    });
  });

  test('Name is either less than 3 characters long or more than 30 characters long.', () => {
    const user = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const quiz = adminQuizCreate(user.jsonBody.token, 'QuizName', 'QuizDescription');

    // bb is two characters, therefore a invalid character
    expect(adminQuizNameUpdate(user.jsonBody.token, quiz.jsonBody.quizId, 'bb')).toEqual({
      statusCode: 400,
      jsonBody: {
        error: expect.any(String)
      }
    });
  });

  test('Name is either less than 3 characters long or more than 30 characters long.', () => {
    const user = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const quiz = adminQuizCreate(user.jsonBody.token, 'QuizName', 'QuizDescription');

    // bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb is 31 characters, therefore a invalid name
    expect(adminQuizNameUpdate(user.jsonBody.token, quiz.jsonBody.quizId, 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')).toEqual({
      statusCode: 400,
      jsonBody: {
        error: expect.any(String)
      }
    });
  });

  test('Name is already used by the current logged in user for another quiz.', () => {
    const user = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    adminQuizCreate(user.jsonBody.token, 'duplicateName', 'quizDuplicateDescription');
    const quiz = adminQuizCreate(user.jsonBody.token, 'duplicateName', 'quizDescription');
    adminQuizNameUpdate(user.jsonBody.token, quiz.jsonBody.quizId, 'duplicateName');
    // duplicateName is already used

    expect(adminQuizNameUpdate(user.jsonBody.token, quiz.jsonBody.quizId, 'duplicateName')).toEqual({
      statusCode: 400,
      jsonBody: {
        error: expect.any(String)
      }
    });
  });
});
