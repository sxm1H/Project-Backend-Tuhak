import {
  clear,
  adminAuthRegister,
  adminQuizCreate,
  adminQuizQuestionMove,
  adminQuizQuestionCreate,
} from './testHelpers';

beforeEach(() => {
  clear();
});

describe('Test PUT /v1/admin/quiz/{quizid}/question/{questionid}/move', () => {
  test('Question Id is does not refer to valid question', () => {
    const { jsonBody: { token } } = adminAuthRegister('pain@gmail.com', 'Wowowowow123', 'Alex', 'Hirsch');
    const { jsonBody: { quizId } } = adminQuizCreate(token, 'cool name', 'cool description');
    const { statusCode, jsonBody } = adminQuizQuestionMove(quizId, 10, token, 1);
    expect(statusCode).toStrictEqual(400);
    expect(jsonBody).toStrictEqual({
      error: expect.any(String)
    });
  });

  test('New Position is less than 0', () => {
    const { jsonBody: { token } } = adminAuthRegister('pain@gmail.com', 'Wowowowow123', 'Alex', 'Hirsch');
    const { jsonBody: { quizId } } = adminQuizCreate(token, 'cool name', 'cool description');
    const { jsonBody: { questionId } } = adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }]);
    const { statusCode, jsonBody } = adminQuizQuestionMove(quizId, questionId, token, -1);
    expect(statusCode).toStrictEqual(400);
    expect(jsonBody).toStrictEqual({
      error: expect.any(String)
    });
  });

  test('New Position is more than number of questions', () => {
    const { jsonBody: { token } } = adminAuthRegister('pain@gmail.com', 'Wowowowow123', 'Alex', 'Hirsch');
    const { jsonBody: { quizId } } = adminQuizCreate(token, 'cool name', 'cool description');
    const { jsonBody: { questionId } } = adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }]);
    const { statusCode, jsonBody } = adminQuizQuestionMove(quizId, questionId, token, 2);
    expect(statusCode).toStrictEqual(400);
    expect(jsonBody).toStrictEqual({
      error: expect.any(String)
    });
  });

  test('New Position is the same position', () => {
    const { jsonBody: { token } } = adminAuthRegister('pain@gmail.com', 'Wowowowow123', 'Alex', 'Hirsch');
    const { jsonBody: { quizId } } = adminQuizCreate(token, 'cool name', 'cool description');
    const { jsonBody: { questionId } } = adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }]);
    const { statusCode, jsonBody } = adminQuizQuestionMove(quizId, questionId, token, 0);
    expect(statusCode).toStrictEqual(400);
    expect(jsonBody).toStrictEqual({
      error: expect.any(String)
    });
  });

  test('Token is invalid', () => {
    const { jsonBody: { token } } = adminAuthRegister('pain@gmail.com', 'Wowowowow123', 'Alex', 'Hirsch');
    const { jsonBody: { quizId } } = adminQuizCreate(token, 'cool name', 'cool description');
    const quest1 = adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }]);
    adminQuizQuestionCreate(quizId, token, 'cool question', 5, 4, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }]);
    const { statusCode, jsonBody } = adminQuizQuestionMove(quizId, quest1.jsonBody.questionId, token + 'POGGERS', 1);
    expect(statusCode).toStrictEqual(401);
    expect(jsonBody).toStrictEqual({
      error: expect.any(String)
    });
  });

  test('User does not own quiz', () => {
    const user1 = adminAuthRegister('pain@gmail.com', 'Wowowowow123', 'Alex', 'Hirsch');
    const user2 = adminAuthRegister('pogchamp@gmail.com', 'thisisvalidpassword1', 'Steve', 'Jobs');
    const { jsonBody: { quizId } } = adminQuizCreate(user2.jsonBody.token, 'cool name', 'cool description');
    const { jsonBody: { questionId } } = adminQuizQuestionCreate(quizId, user2.jsonBody.token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }]);
    adminQuizQuestionCreate(quizId, user2.jsonBody.token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }]);
    const { statusCode, jsonBody } = adminQuizQuestionMove(quizId, questionId, user1.jsonBody.token, 1);
    expect(statusCode).toStrictEqual(403);
    expect(jsonBody).toStrictEqual({
      error: expect.any(String)
    });
  });

  test('Successful question move', () => {
    const { jsonBody: { token } } = adminAuthRegister('pain@gmail.com', 'Wowowowow123', 'Alex', 'Hirsch');
    const { jsonBody: { quizId } } = adminQuizCreate(token, 'cool name', 'cool description');
    const { jsonBody: { questionId } } = adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }]);
    adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }]);
    const { statusCode, jsonBody } = adminQuizQuestionMove(quizId, questionId, token, 1);
    expect(statusCode).toStrictEqual(200);
    expect(jsonBody).toStrictEqual({});
  });
});
