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
    const {statusCode, jsonBody} = adminQuizList(999999999999999);
    expect(statusCode).toStrictEqual(401);
    expect(jsonBody).toStrictEqual({
      error: expect.any(String)
    })
  });

  test('non valid user id with users', () => {
    const {jsonBody: {authUserId} } = adminAuthRegister('pain@gmail.com', 'Wowowowow123', 'Alex', 'Hirsch');
    const {statusCode, jsonBody} = adminQuizList(authUserId + 1);
    expect(statusCode).toStrictEqual(401);
    expect(jsonBody).toStrictEqual({
      error: expect.any(String)
    });
  });

  
  test('User Id Quiz List successfully accessed', () => {
    const {jsonBody: {authUserId} } = adminAuthRegister('pogchamp@gmail.com', 'thisisvalidpassword1', 'Steve', 'Jobs');
    const {statusCode, jsonBody} = adminQuizList(authUserId)
    expect(statusCode).toStrictEqual(200);
    expect(jsonBody).toStrictEqual({
      quizzes: []
    });

    const {jsonBody: {quizId} } = adminQuizCreate(authUserId, 'creative name', 'description');
    const list2 = adminQuizList(authUserId);

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
