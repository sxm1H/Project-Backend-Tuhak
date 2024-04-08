import {
  clear,
  adminAuthRegister,
  adminQuizCreate,
  adminQuizInfo,
  adminQuizQuestionCreate,
  adminQuizQuestionDuplicate,
} from './testHelpers';

let token: string;
let quizId: number;
beforeEach(() => {
  clear();

  token = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh').jsonBody.token;
  quizId = adminQuizCreate(token, 'cool quiz', 'cool desc').jsonBody.quizId;
});

describe('Testing POST /v1/admin/quiz/:quizid/question/:questionid/duplicate', () => {
  test('Question successfully duplicated', () => {
    const { jsonBody: { questionId } } = adminQuizQuestionCreate(quizId, token, 'cool question', 4, 5, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }]);
    const { statusCode, jsonBody } = adminQuizQuestionDuplicate(token, quizId, questionId);
    expect(statusCode).toStrictEqual(200);
    expect(jsonBody).toStrictEqual({
      newQuestionId: expect.any(Number)
    });
    const updatedDate = Math.floor(Date.now() / 1000);
    const timeLastEdited = adminQuizInfo(token, quizId).jsonBody.timeLastEdited;
    expect(updatedDate).toBeGreaterThanOrEqual(timeLastEdited);
    expect(updatedDate).toBeLessThanOrEqual(timeLastEdited + 2);
  });

  test('Question Id does not refer to valid question', () => {
    const { statusCode, jsonBody } = adminQuizQuestionDuplicate(token, quizId, 1);
    expect(statusCode).toStrictEqual(400);
    expect(jsonBody).toStrictEqual({
      error: expect.any(String)
    });
  });

  test('Quiz Id does not refer to existing quiz', () => {
    expect(adminQuizQuestionDuplicate(token, -100000000, 1)).toStrictEqual(
      {
        statusCode: 403,
        jsonBody: { error: expect.any(String) }
      }
    );
  });

  test('Token is invalid', () => {
    const { jsonBody: { questionId } } = adminQuizQuestionCreate(quizId, token, 'cool question', 4, 5, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }]);
    const { statusCode, jsonBody } = adminQuizQuestionDuplicate(token.concat('POG'), quizId, questionId);
    expect(statusCode).toStrictEqual(401);
    expect(jsonBody).toStrictEqual({
      error: expect.any(String)
    });
  });

  test('User is not owner of the quiz', () => {
    const token2 = adminAuthRegister('abcd@gmail.com', 'abcd1234', 'ahhhhh', 'hello').jsonBody.token;
    const { jsonBody: { questionId } } = adminQuizQuestionCreate(quizId, token, 'cool question', 4, 5, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }]);
    const { statusCode, jsonBody } = adminQuizQuestionDuplicate(token2, quizId, questionId);
    expect(statusCode).toStrictEqual(403);
    expect(jsonBody).toStrictEqual({
      error: expect.any(String)
    });
  });
});
