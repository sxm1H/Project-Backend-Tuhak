import {
  clear,
  adminAuthRegister,
} from '../iteration2Tests/testHelpers';
import {
  v2adminQuizCreate,
  v2adminQuizInfo,
  adminQuizRestore,
  v2adminQuizRemove,
  adminQuizList
} from './v2testHelpers';

import HTTPError from 'http-errors';

let token: string;
let quizId: number;
let time: number;
beforeEach(() => {
  clear();

  token = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo').token;
  quizId = v2adminQuizCreate(token, 'quiz1', 'lorem ipsum').quizId;
  time = Math.floor(Date.now() / 1000);
});

describe('Testing GET /v1/admin/quiz/:quizid', () => {
  test('Successfully restores quiz from trash', () => {
    expect(adminQuizList(token)).toStrictEqual({
      quizzes: [
        {
          quizId: quizId,
          name: 'quiz1'
        }
      ]
    });

    v2adminQuizRemove(token, quizId);

    expect(adminQuizList(token)).toStrictEqual({
      quizzes: []
    });

    adminQuizRestore(token, quizId);

    expect(adminQuizList(token)).toStrictEqual({
      quizzes: [
        {
          quizId: quizId,
          name: 'quiz1'
        }
      ]
    });

    const info = v2adminQuizInfo(token, quizId);

    expect(info.timeLastEdited).toBeGreaterThanOrEqual(time);
    expect(info.timeLastEdited).toBeLessThanOrEqual(time + 2);
  });

  test('Quiz name of restored quiz is already used by another active quiz', () => {
    expect(adminQuizList(token)).toStrictEqual({
      quizzes: [
        {
          quizId: quizId,
          name: 'quiz1'
        }
      ]
    });

    v2adminQuizRemove(token, quizId);

    expect(adminQuizList(token)).toStrictEqual({
      quizzes: []
    });

    v2adminQuizCreate(token, 'quiz1', 'description');

    expect(() => adminQuizRestore(token, quizId)).toThrow(HTTPError[400]);
  });

  test('Quiz ID refers to quiz not in trash', () => {
    expect(adminQuizList(token)).toStrictEqual({
      quizzes: [
        {
          quizId: quizId,
          name: 'quiz1'
        }
      ]
    });

    v2adminQuizRemove(token, quizId);

    expect(adminQuizList(token)).toStrictEqual({
      quizzes: []
    });

    const quizId2 = v2adminQuizCreate(token, 'Qu1', 'dsdasas').quizId;

    expect(() => adminQuizRestore(token, quizId2)).toThrow(HTTPError[400]);
  });

  test('User is not logged in', () => {
    expect(adminQuizList(token)).toStrictEqual({
      quizzes: [
        {
          quizId: quizId,
          name: 'quiz1'
        }
      ]
    });

    v2adminQuizRemove(token, quizId);

    expect(adminQuizList(token)).toStrictEqual({
      quizzes: []
    });

    expect(() => adminQuizRestore(token + 'hello', quizId)).toThrow(HTTPError[401]);
  });

  test('Valid token, but user not owner of quiz', () => {
    expect(adminQuizList(token)).toStrictEqual({
      quizzes: [
        {
          quizId: quizId,
          name: 'quiz1'
        }
      ]
    });

    v2adminQuizRemove(token, quizId);

    expect(adminQuizList(token)).toStrictEqual({
      quizzes: []
    });

    const newUser = adminAuthRegister('nick@unsw.edu.au', 'abcd1234', 'nick', 'yes');

    expect(() => adminQuizRestore(newUser.token, quizId)).toThrow(HTTPError[403]);
  });

  test('Test Unsuccessful: Invalid QuizId', () => {
    v2adminQuizRemove(token, quizId);
    expect(() => adminQuizRestore(token, -1)).toThrow(HTTPError[403]);
  });
});
