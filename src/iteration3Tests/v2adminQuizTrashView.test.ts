import {
  clear,
  adminAuthRegister,
} from '../iteration2Tests/testHelpers';
import {
  v2adminQuizCreate,
  adminQuizTrashView,
  v2adminQuizRemove,
} from './v2testHelpers';
import HTTPError from 'http-errors';

let token: string;
beforeEach(() => {
  clear();

  token = adminAuthRegister('fakerT1@gmail.com', 'pass123word', 'Smith', 'John').token;
});

describe('Test GET /v1/admin/quiz/trash', () => {
  test.each([
    {
      name: 'good name',
      description: 'Loud screaming is too long'
    },
    {
      name: 'blank quiz',
      description: ''
    }
  ])('Successful Quiz Created', ({ name, description }) => {
    const quizId = v2adminQuizCreate(token, name, description).quizId;
    console.log(v2adminQuizRemove(token, quizId));
    // console.log(adminQuizTrashView(token));
    expect(adminQuizTrashView(token)).toStrictEqual({
      quizzes: [
        {
          quizId: expect.any(Number),
          name: expect.any(String)
        }
      ]
    });
  });

  test.each([
    {
      name: 'good name',
      description: 'Loud screaming is too long'
    },
    {
      name: 'blank quiz',
      description: ''
    }
  ])('Empty Token', ({ name, description }) => {
    const quizId = v2adminQuizCreate(token, name, description).quizId;
    v2adminQuizRemove(token, quizId);
    expect(() => adminQuizTrashView('')).toThrow(HTTPError[401]);
  });

  test.each([
    {
      name: 'good name',
      description: 'Loud screaming is too long'
    },
    {
      name: 'blank quiz',
      description: ''
    }
  ])('Wrong token', ({ name, description }) => {
    const quizId = v2adminQuizCreate(token, name, description).quizId;
    v2adminQuizRemove(token, quizId);
    expect(() => adminQuizTrashView(token + '1')).toThrow(HTTPError[401]);
  });
});
