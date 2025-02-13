import {
  clear,
  adminAuthRegister,
  adminQuizList,
  adminQuizCreate,
} from './testHelpers';
import HTTPError from 'http-errors';
let token: string;
beforeEach(() => {
  clear();

  token = adminAuthRegister('pain@gmail.com', 'Wowowowow123', 'Alex', 'Hirsch').token;
});

describe('Test GET /v1/admin/quiz/list', () => {
  test('Token invalid', () => {
    expect(() => adminQuizList(token + '1')).toThrow(HTTPError[401]);
  });

  test('User Id Quiz List successfully accessed', () => {
    expect(adminQuizList(token)).toStrictEqual({
      quizzes: []
    });

    const id = adminQuizCreate(token, 'creative name', 'description').quizId;
    const list2 = adminQuizList(token);
    expect(list2).toStrictEqual({
      quizzes: [
        {
          quizId: id,
          name: 'creative name'
        }
      ]
    });
  });
});
