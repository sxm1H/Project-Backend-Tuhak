import {
  clear,
  adminAuthRegister,
  adminQuizCreate,
  adminQuizNameUpdate,
} from './testHelpers';

beforeEach(() => {
  clear();
});

describe('adminQuizNameUpdate', () => {
  test('Successful test case', () => {
    const user = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const quiz = adminQuizCreate(user.jsonBody.token, 'QuizName', 'QuizDescription');

    expect(adminQuizNameUpdate(user.jsonBody.token, quiz.jsonBody.quizId, 'newName')).toEqual({
      statusCode: 200,
      jsonBody: {

      }
    });
  });
  /*
  test('Comprehensive successful test case', () => {
    const user = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const quiz = adminQuizCreate(user.jsonBody.authUserId, 'QuizName', 'QuizDescription');
    let quizList = adminQuizList(userReg.authUserId);

    expect(quizList).toStrictEqual({
      quizzes: [
        {
          quizId: quiz.quizId,
          name: 'QuizName'
        }
      ]
    });

    const quiz2 = adminQuizCreate(userReg.authUserId, 'new quiz hello', 'hihihihi');

    expect(adminQuizNameUpdate(userReg.authUserId, quiz.quizId, 'newName')).toEqual({});
    quizList = adminQuizList(userReg.authUserId);
    expect(quizList).toStrictEqual({
      quizzes: [
        {
          quizId: quiz.quizId,
          name: 'newName'
        },
        {
          quizId: quiz2.quizId,
          name: 'new quiz hello'
        }
      ]
    });

    expect(adminQuizNameUpdate(userReg.authUserId, quiz2.quizId, 'omg new name')).toEqual({});
    quizList = adminQuizList(userReg.authUserId);
    expect(quizList).toStrictEqual({
      quizzes: [
        {
          quizId: quiz.quizId,
          name: 'newName'
        },
        {
          quizId: quiz2.quizId,
          name: 'omg new name'
        }
      ]
    });
  });
*/
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
