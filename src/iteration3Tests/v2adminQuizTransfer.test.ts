import {
  clear,
  adminAuthRegister,
} from '../iteration2Tests/testHelpers';
import {
  v2adminQuizCreate,
  adminQuizList,
  v2adminQuizTransfer,
  v2adminQuizRemove
} from './v2testHelpers';
import HTTPError from 'http-errors';

let token: string;
let token2: string;
let quizId: number;
beforeEach(() => {
  clear();

  token = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo').token;
  token2 = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian').token;
  quizId = v2adminQuizCreate(token, 'Cool name', 'lorem ipsum').quizId;
});

describe('Testing POST /v1/admin/quiz/:quizid/transfer', () => {
  test('Successful transfer', () => {
    expect(v2adminQuizTransfer(token, 'nick1234@gmail.com', quizId)).toStrictEqual({});

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
    expect(() => v2adminQuizTransfer(token, 'fake@gmail.com', quizId)).toThrow(HTTPError[400]);
  });

  test('userEmail is the current logged in user', () => {
    expect(() => v2adminQuizTransfer(token, 'dunyao@unsw.edu.au', quizId)).toThrow(HTTPError[400]);
  });

  test('Target user owns a quiz with the same name', () => {
    v2adminQuizCreate(token2, 'Cool name', 'ipsum lorem');

    expect(() => v2adminQuizTransfer(token, 'nick1234@gmail.com', quizId)).toThrow(HTTPError[400]);
  });

  test('Token invalid', () => {
    expect(() => v2adminQuizTransfer(token + 'hello', 'nick1234@gmail.com', quizId)).toThrow(HTTPError[401]);
  });

  test('User does not own quiz', () => {
    const quizId2 = v2adminQuizCreate(token2, 'Very cool name', 'bing bong').quizId;

    expect(() => v2adminQuizTransfer(token, 'nick1234@gmail.com', quizId2)).toThrow(HTTPError[403]);
  });

  test('Quiz does not exist', () => {
    v2adminQuizRemove(token, quizId);

    expect(() => v2adminQuizTransfer(token, 'nick1234@gmail.com', quizId)).toThrow(HTTPError[403]);
  });
});
