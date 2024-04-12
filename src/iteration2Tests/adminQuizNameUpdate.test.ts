import {
  clear,
  adminAuthRegister,
  adminQuizCreate,
  adminQuizNameUpdate,
  adminQuizList,
} from './testHelpersIter2';

let token: string;
let quizId: number;
beforeEach(() => {
  clear();

  token = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian').jsonBody.token;
  quizId = adminQuizCreate(token, 'QuizName', 'QuizDescription').jsonBody.quizId;
});

describe('adminQuizNameUpdate', () => {
  test('Successful test case', () => {
    expect(adminQuizNameUpdate(token, quizId, 'newName')).toStrictEqual({
      statusCode: 200,
      jsonBody: {}
    });
  });

  test('Comprehensive successful test case', () => {
    let quizList = adminQuizList(token);

    expect(quizList).toStrictEqual({
      jsonBody: {
        quizzes: [
          {
            quizId: quizId,
            name: 'QuizName'
          }
        ]
      },
      statusCode: 200
    });

    const quizId2 = adminQuizCreate(token, 'new quiz hello', 'hihihihi').jsonBody.quizId;

    expect(adminQuizNameUpdate(token, quizId, 'newName')).toStrictEqual({
      jsonBody: {},
      statusCode: 200
    });
    quizList = adminQuizList(token);
    expect(quizList).toStrictEqual({
      jsonBody: {
        quizzes: [
          {
            quizId: quizId,
            name: 'newName'
          },
          {
            quizId: quizId2,
            name: 'new quiz hello'
          }
        ]
      },
      statusCode: 200
    });

    expect(adminQuizNameUpdate(token, quizId2, 'omg new name')).toStrictEqual({
      jsonBody: {},
      statusCode: 200
    });

    quizList = adminQuizList(token);
    expect(quizList).toStrictEqual({
      jsonBody: {
        quizzes: [
          {
            quizId: quizId,
            name: 'newName'
          },
          {
            quizId: quizId2,
            name: 'omg new name'
          }
        ]
      },
      statusCode: 200
    });
  });

  test('Token session is not a valid user', () => {
    // 1234 being not a valid authUserId
    expect(adminQuizNameUpdate(token + 'hello', quizId, 'newName')).toEqual({
      statusCode: 401,
      jsonBody: {
        error: expect.any(String)
      }
    });
  });

  test('Quiz ID does not refer to a valid quiz.', () => {
    // 1234 being not a valid quizId
    expect(adminQuizNameUpdate(token, quizId + 1, 'newName')).toEqual({
      statusCode: 403,
      jsonBody: {
        error: expect.any(String)
      }
    });
  });

  test('Quiz ID does not refer to a quiz that this user owns.', () => {
    const token2 = adminAuthRegister('dunyao1234@gmail.com', 'DunYao1234', 'DunYao', 'Foooooooooo').jsonBody.token;

    expect(adminQuizNameUpdate(token2, quizId, 'newName')).toEqual({
      statusCode: 403,
      jsonBody: { error: expect.any(String) }
    });
  });

  test('Name contains invalid characters. Valid characters are alphanumeric and spaces.', () => {
    // 🚫 is an emoji, therefore a invalid character
    expect(adminQuizNameUpdate(token, quizId, '🚫')).toEqual({
      statusCode: 400,
      jsonBody: {
        error: expect.any(String)
      }
    });
  });

  test('Name is either less than 3 characters long or more than 30 characters long.', () => {
    // bb is two characters, therefore a invalid character
    expect(adminQuizNameUpdate(token, quizId, 'bb')).toEqual({
      statusCode: 400,
      jsonBody: {
        error: expect.any(String)
      }
    });
  });

  test('Name is either less than 3 characters long or more than 30 characters long.', () => {
    // bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb is 31 characters, therefore a invalid name
    expect(adminQuizNameUpdate(token, quizId, 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')).toEqual({
      statusCode: 400,
      jsonBody: {
        error: expect.any(String)
      }
    });
  });

  test('Name is already used by the current logged in user for another quiz.', () => {
    adminQuizCreate(token, 'duplicateName', 'quizDuplicateDescription');
    adminQuizNameUpdate(token, quizId, 'duplicateName');
    // duplicateName is already used

    expect(adminQuizNameUpdate(token, quizId, 'duplicateName')).toEqual({
      statusCode: 400,
      jsonBody: {
        error: expect.any(String)
      }
    });
  });
});
