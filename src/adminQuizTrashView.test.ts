import {
  clear,
  adminAuthRegister,
  adminQuizCreate,
  adminQuizTrashView,
  adminQuizRemove,
} from './testHelpers';

beforeEach(() => {
  clear();
});
describe('Test GET /v1/admin/quiz/list', () => {
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
    const { jsonBody: { token } } = adminAuthRegister('fakerT1@gmail.com', 'pass123word', 'Smith', 'John');
    const { jsonBody: { quizId } } = adminQuizCreate(token, name, description);
    adminQuizRemove(token, quizId);
    const { statusCode, jsonBody } = adminQuizTrashView(token);
    expect(statusCode).toStrictEqual(200);
    expect(jsonBody).toStrictEqual({
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
    const { jsonBody: { token } } = adminAuthRegister('fakerT1@gmail.com', 'pass123word', 'Smith', 'John');
    const { jsonBody: { quizId } } = adminQuizCreate(token, name, description);
    adminQuizRemove(token, quizId);
    const { statusCode, jsonBody } = adminQuizTrashView('');
    expect(statusCode).toStrictEqual(401);
    expect(jsonBody).toStrictEqual({
      error: expect.any(String)
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
  ])('Wrong token', ({ name, description }) => {
    const { jsonBody: { token } } = adminAuthRegister('fakerT1@gmail.com', 'pass123word', 'Smith', 'John');
    const { jsonBody: { quizId } } = adminQuizCreate(token, name, description);
    adminQuizRemove(token, quizId);
    const { statusCode, jsonBody } = adminQuizTrashView(token + '1');
    expect(statusCode).toStrictEqual(401);
    expect(jsonBody).toStrictEqual({
      error: expect.any(String)
    });
  });
});
