import {
  clear,
  adminQuizTrashEmpty,
  adminQuizRemove,
  adminAuthRegister,
  adminQuizCreate,
  adminQuizList,
} from './testHelpers';
import HTTPError from 'http-errors';

let token: string;
let quizId: number;
beforeEach(() => {
  clear();

  token = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo').token;
  quizId = adminQuizCreate(token, 'quiz1', 'lorem ipsum').quizId;
});

describe('Testing DELETE /v1/admin/quiz/trash/empty', () => {
  test('Successfully empties trash', () => {
    expect(adminQuizList(token)).toStrictEqual({
      quizzes: [
        {
          quizId: quizId,
          name: 'quiz1'
        }
      ]
    });

    adminQuizRemove(token, quizId);

    expect(adminQuizList(token)).toStrictEqual({
      quizzes: []
    });

    const stringArray = `[${quizId}]`;

    expect(adminQuizTrashEmpty(token, stringArray)).toStrictEqual({});
  });

  test('Invalid token', () => {
    expect(adminQuizList(token)).toStrictEqual({
      quizzes: [
        {
          quizId: quizId,
          name: 'quiz1'
        }
      ]
    });

    adminQuizRemove(token, quizId);

    expect(adminQuizList(token)).toStrictEqual({
      quizzes: []
    });

    const stringArray = `[${quizId}]`;

    expect(() => adminQuizTrashEmpty(token + 'hello', stringArray)).toThrow(HTTPError[401]);
  });

  test('Quiz not in trash', () => {
    expect(adminQuizList(token)).toStrictEqual({
      quizzes: [
        {
          quizId: quizId,
          name: 'quiz1'
        }
      ]
    });

    adminQuizRemove(token, quizId);

    expect(adminQuizList(token)).toStrictEqual({
      quizzes: []
    });

    const create = adminQuizCreate(token, 'quiz2', 'lorem ipsum');

    const stringArray = `[${quizId}, ${create.quizId}]`;

    expect(() => adminQuizTrashEmpty(token, stringArray)).toThrow(HTTPError[400]);
  });

  test('Quiz does not belong to user, but is in trash', () => {
    expect(adminQuizList(token)).toStrictEqual({
      quizzes: [
        {
          quizId: quizId,
          name: 'quiz1'
        }
      ]
    });

    adminQuizRemove(token, quizId);

    expect(adminQuizList(token)).toStrictEqual({
      quizzes: []
    });

    const newUser = adminAuthRegister('nick@unsw.edu.au', 'nick1234', 'nicholas', 'sebastian');
    const create = adminQuizCreate(newUser.token, 'quiz2', 'lorem ipsum');

    adminQuizRemove(newUser.token, create.quizId);

    const stringArray = `[${quizId}, ${create.quizId}]`;

    expect(() => adminQuizTrashEmpty(token, stringArray)).toThrow(HTTPError[403]);
  });

  test('Test Unsuccessful: Invalid QuizId', () => {
    adminQuizRemove(token, quizId);

    const stringArray = `[${-1}]`;

    expect(() => adminQuizTrashEmpty(token, stringArray)).toThrow(HTTPError[403]);
  });
});
