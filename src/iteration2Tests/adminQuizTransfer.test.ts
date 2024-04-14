import {
  clear,
  adminAuthRegister,
  adminQuizCreate,
  adminQuizList,
  adminQuizTransfer,
  adminQuizRemove
} from './testHelpersIter2';
import HTTPError from 'http-errors';

let token: string;
let token2: string;
let quizId: number;
beforeEach(() => {
  clear();

  token = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo').token;
  token2 = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian').token;
  quizId = adminQuizCreate(token, 'Cool name', 'lorem ipsum').quizId;
});

describe('Testing POST /v1/admin/quiz/:quizid/transfer', () => {
  test('Successful transfer', () => {
    expect(adminQuizTransfer(token, 'nick1234@gmail.com', quizId)).toStrictEqual({});

    expect(adminQuizList(token2)).toStrictEqual({
      quizzes: [
        {
          quizId: quizId,
          name: 'Cool name'
        }
      ]
    });
  });

  test('userEmail is not a real user', () => {
    expect(() => adminQuizTransfer(token, 'fake@gmail.com', quizId)).toThrow(HTTPError[400]);
  });

  test('userEmail is the current logged in user', () => {
    expect(() => adminQuizTransfer(token, 'dunyao@unsw.edu.au', quizId)).toThrow(HTTPError[400]);
  });

  test('Target user owns a quiz with the same name', () => {
    adminQuizCreate(token2, 'Cool name', 'ipsum lorem');

    expect(() => adminQuizTransfer(token, 'nick1234@gmail.com', quizId)).toThrow(HTTPError[400]);
  });

  test('Token invalid', () => {
    expect(() => adminQuizTransfer(token + 'hello', 'nick1234@gmail.com', quizId)).toThrow(HTTPError[401]);
  });

  test('User does not own quiz', () => {
    const quizId2 = adminQuizCreate(token2, 'Very cool name', 'bing bong').quizId;

    expect(() => adminQuizTransfer(token, 'nick1234@gmail.com', quizId2)).toThrow(HTTPError[403]);
  });

  test('Quiz does not exist', () => {
    adminQuizRemove(token, quizId);

    expect(() => adminQuizTransfer(token, 'nick1234@gmail.com', quizId)).toThrow(HTTPError[403]);
  });
});
