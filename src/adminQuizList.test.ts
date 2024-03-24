import {
  clear,
  adminAuthRegister,
  adminQuizList,
  adminQuizCreate,
} from './testHelpers';

beforeEach(() => {
  clear();
});

describe('Test GET /v1/admin/quiz/list', () => {
  test('Non valid User Id', () => {
    const {statusCode, jsonBody} = adminQuizList('999999999999999');
    expect(statusCode).toStrictEqual(401);
    expect(jsonBody).toStrictEqual({
      error: expect.any(String)
    })
  });

  test('non valid user id with users', () => {
    const {jsonBody: {token} } = adminAuthRegister('pain@gmail.com', 'Wowowowow123', 'Alex', 'Hirsch');
    const {statusCode, jsonBody} = adminQuizList(token.concat('Hello'));
    expect(statusCode).toStrictEqual(401);
    expect(jsonBody).toStrictEqual({
      error: expect.any(String)
    });
  });

  
  test('User Id Quiz List successfully accessed', () => {
    const {jsonBody: {token} } = adminAuthRegister('pogchamp@gmail.com', 'thisisvalidpassword1', 'Steve', 'Jobs');
    const {statusCode, jsonBody} = adminQuizList(token);
    expect(statusCode).toStrictEqual(200);
    expect(jsonBody).toStrictEqual({
      quizzes: []
    });

    const {jsonBody: {quizId} } = adminQuizCreate(token, 'creative name', 'description');
    const list2 = adminQuizList(token);

    expect(list2.statusCode).toStrictEqual(200);
    expect(list2.jsonBody).toStrictEqual({
      quizzes: [
        {
          quizId: quizId,
          name: 'creative name'
        }
      ]
    });
  });
});
