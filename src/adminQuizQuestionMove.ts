import {
  clear,
  adminAuthRegister,
  adminQuizCreate,
  adminQuizQuestionMove,
} from './testHelpers';

beforeEach(() => {
  clear();
});

describe('Test PUT /v1/admin/quiz/{quizid}/question/{questionid}/move', () => {
  test('Question Id is does not refer to valid question', () => {
    const {jsonBody: {token}} = adminAuthRegister('pain@gmail.com', 'Wowowowow123', 'Alex', 'Hirsch');
    const {statusCode, jsonBody} = adminQuizQuestionMove(1, 10, token, 1);
    expect(statusCode).toStrictEqual(400);
    expect(jsonBody).toStrictEqual({
      error: expect.any(String)
    });
  });

  test('New Position is less than 0', () => {
    const {jsonBody: {token}} = adminAuthRegister('pain@gmail.com', 'Wowowowow123', 'Alex', 'Hirsch');
    const {jsonBody: {quizId}} = adminQuizCreate(token, 'cool name', 'cool description');
    const {jsonBody: {questionId}} = adminQuizQuestionCreate();
    const {statusCode, jsonBody} = adminQuizQuestionMove(quizId, questionId, token, -1);
    expect(statusCode).toStrictEqual(400);
    expect(jsonBody).toStrictEqual({
      error: expect.any(String)
    });
  });

  test('New Position is more than number of questions', () => {
    const {jsonBody: {token}} = adminAuthRegister('pain@gmail.com', 'Wowowowow123', 'Alex', 'Hirsch');
    const {jsonBody: {quizId}} = adminQuizCreate(token, 'cool name', 'cool description');
    const {jsonBody: {questionId}} = adminQuizQuestionCreate();
    const {statusCode, jsonBody} = adminQuizQuestionMove(quizId, questionId, token, 2);
    expect(statusCode).toStrictEqual(400);
    expect(jsonBody).toStrictEqual({
      error: expect.any(String)
    });
  })

  test('New Position is the same position', () => {
    const {jsonBody: {token}} = adminAuthRegister('pain@gmail.com', 'Wowowowow123', 'Alex', 'Hirsch');
    const {jsonBody: {quizId}} = adminQuizCreate(token, 'cool name', 'cool description');
    const {jsonBody: {questionId}} = adminQuizQuestionCreate();
    const {statusCode, jsonBody} = adminQuizQuestionMove(quizId, questionId, token, 0);
    expect(statusCode).toStrictEqual(400);
    expect(jsonBody).toStrictEqual({
      error: expect.any(String)
    });
  });

  test('Token is invalid', () => {
    const {jsonBody: {quizId}} = adminQuizCreate(token, 'cool name', 'cool description');
    let quest1 = adminQuizQuestionCreate();
    let quest2 = adminQuizQuestionCreate();
    const {statusCode, jsonBody} = adminQuizQuestionMove(quizId, quest1.jsonBody.questionId, 'hello', 1);
    expect(statusCode).toStrictEqual(401);
    expect(jsonBody).toStrictEqual({
      error: expect.any(String)
    });
  });

  test('User does not own quiz', () => {
    const user1 = adminAuthRegister('pain@gmail.com', 'Wowowowow123', 'Alex', 'Hirsch');
    const user2 = adminAuthRegister('pogchamp@gmail.com', 'thisisvalidpassword1', 'Steve', 'Jobs');
    const {jsonBody: {quizId}} = adminQuizCreate(user2.jsonBody.token, 'cool name', 'cool description');
    const {jsonBody: {questionId}} = adminQuizQuestionCreate();
    const {statusCode, jsonBody} = adminQuizQuestionMove(quizId, quest1.jsonBody.questionId, user1.jsonBody.token, 1);
    expect(statusCode).toStrictEqual(400);
    expect(jsonBody).toStrictEqual({
      error: expect.any(String)
    });
  })
})
