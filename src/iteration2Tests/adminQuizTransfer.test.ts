import {
  clear,
  adminAuthRegister,
  adminQuizCreate,
  adminQuizList,
  adminQuizTransfer,
  adminQuizRemove
} from './testHelpersIter2';

let token: string;
let token2: string;
let quizId: number;
beforeEach(() => {
  clear();

  token = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo').jsonBody.token;
  token2 = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian').jsonBody.token;
  quizId = adminQuizCreate(token, 'Cool name', 'lorem ipsum').jsonBody.quizId;
});

describe('Testing POST /v1/admin/quiz/:quizid/transfer', () => {
  test('Successful transfer', () => {
    expect(adminQuizTransfer(token, 'nick1234@gmail.com', quizId)).toStrictEqual(
      {
        statusCode: 200,
        jsonBody: {}
      }
    );

    expect(adminQuizList(token2).jsonBody).toStrictEqual(
      {
        quizzes: [
          {
            quizId: quizId,
            name: 'Cool name'
          }
        ]
      }
    );
  });

  test('userEmail is not a real user', () => {
    expect(adminQuizTransfer(token, 'fake@gmail.com', quizId)).toStrictEqual(
      {
        statusCode: 400,
        jsonBody: { error: expect.any(String) }
      }
    );
  });

  test('userEmail is the current logged in user', () => {
    expect(adminQuizTransfer(token, 'dunyao@unsw.edu.au', quizId)).toStrictEqual(
      {
        statusCode: 400,
        jsonBody: { error: expect.any(String) }
      }
    );
  });

  test('Target user owns a quiz with the same name', () => {
    adminQuizCreate(token2, 'Cool name', 'ipsum lorem');

    expect(adminQuizTransfer(token, 'nick1234@gmail.com', quizId)).toStrictEqual(
      {
        statusCode: 400,
        jsonBody: { error: expect.any(String) }
      }
    );
  });

  test('Token invalid', () => {
    expect(adminQuizTransfer(token + 'hello', 'nick1234@gmail.com', quizId)).toStrictEqual(
      {
        statusCode: 401,
        jsonBody: { error: expect.any(String) }
      }
    );
  });

  test('User does not own quiz', () => {
    const quizId2 = adminQuizCreate(token2, 'Very cool name', 'bing bong').jsonBody.quizId;

    expect(adminQuizTransfer(token, 'nick1234@gmail.com', quizId2)).toStrictEqual(
      {
        statusCode: 403,
        jsonBody: { error: expect.any(String) }
      }
    );
  });

  test('Quiz does not exist', () => {
    adminQuizRemove(token, quizId);

    expect(adminQuizTransfer(token, 'nick1234@gmail.com', quizId)).toStrictEqual(
      {
        statusCode: 403,
        jsonBody: { error: expect.any(String) }
      }
    );
  });
});
