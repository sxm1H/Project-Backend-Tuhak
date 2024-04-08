import {
  clear,
  adminAuthRegister,
  adminQuizCreate,
  adminQuizQuestionMove,
  adminQuizQuestionCreate,
} from './testHelpers';

let token: string;
let quizId: number;
beforeEach(() => {
  clear();

  token = adminAuthRegister('pain@gmail.com', 'Wowowowow123', 'Alex', 'Hirsch').jsonBody.token;
  quizId = adminQuizCreate(token, 'cool name', 'cool description').jsonBody.quizId;
});

describe('Testing PUT /v1/admin/quiz/{quizid}/question/{questionid}/move', () => {
  test('Question Id is does not refer to valid question', () => {
    const { statusCode, jsonBody } = adminQuizQuestionMove(quizId, 10, token, 1);

    expect(statusCode).toStrictEqual(400);
    expect(jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('New Position is less than 0', () => {
    const questionId = adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }]).jsonBody.questionId;
    const { statusCode, jsonBody } = adminQuizQuestionMove(quizId, questionId, token, -1);

    expect(statusCode).toStrictEqual(400);
    expect(jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('New Position is more than number of questions', () => {
    const questionId = adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }]).jsonBody.questionId;
    const { statusCode, jsonBody } = adminQuizQuestionMove(quizId, questionId, token, 2);

    expect(statusCode).toStrictEqual(400);
    expect(jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('New Position is the same position', () => {
    const questionId = adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }]).jsonBody.questionId;
    const { statusCode, jsonBody } = adminQuizQuestionMove(quizId, questionId, token, 0);

    expect(statusCode).toStrictEqual(400);
    expect(jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Token is invalid', () => {
    const quest1 = adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }]);
    adminQuizQuestionCreate(quizId, token, 'cool question', 5, 4, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }]);
    const { statusCode, jsonBody } = adminQuizQuestionMove(quizId, quest1.jsonBody.questionId, token + 'POGGERS', 1);

    expect(statusCode).toStrictEqual(401);
    expect(jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('User does not own quiz', () => {
    const token2 = adminAuthRegister('pogchamp@gmail.com', 'thisisvalidpassword1', 'Steve', 'Jobs').jsonBody.token;
    const quizId2 = adminQuizCreate(token2, 'cool name', 'cool description').jsonBody.quizId;
    const questionId = adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }]).jsonBody.questionId;
    adminQuizQuestionCreate(quizId, token2, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }]);
    const { statusCode, jsonBody } = adminQuizQuestionMove(quizId2, questionId, token, 1);
    expect(statusCode).toStrictEqual(403);
    expect(jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Successful question move', () => {
    const questionId = adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }]).jsonBody.questionId;
    adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }]);
    const { statusCode, jsonBody } = adminQuizQuestionMove(quizId, questionId, token, 1);
    expect(statusCode).toStrictEqual(200);
    expect(jsonBody).toStrictEqual({});
  });

  test('Test Unsuccessful: Invalid Quiz Id', () => {
    const questionId = adminQuizQuestionCreate(quizId, token, 'cool question', 5, 5, [{ answer: 'Correct', correct: true }, { answer: 'Wrong', correct: false }]).jsonBody.questionId;
    expect(adminQuizQuestionMove(-1, questionId, token, 1)).toStrictEqual({
      jsonBody: {
        error: expect.any(String),
      },
      statusCode: 403,
    });
  })
});
