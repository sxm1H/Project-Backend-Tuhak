import {
  clear,
  adminAuthRegister,
  adminQuizCreate,
  adminQuizQuestionDelete,
  adminQuizQuestionCreate,
  adminQuizInfo,
} from './testHelpers';

let token: string;
let quizId: number;
let questionId: number;
beforeEach(() => {
  clear();

  token = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh').jsonBody.token;
  quizId = adminQuizCreate(token, 'Australian Cities', 'lorem ipsum').jsonBody.quizId;
  questionId = adminQuizQuestionCreate(quizId, token, 'Question1', 5, 5, [{ answer: 'Melb', correct: true }, { answer: 'Syd', correct: false }]).jsonBody.questionId;
});

describe('Testing DELETE /v1/admin/quiz/:quizid/question/:questionid', () => {
  test('Comprehensive Test Successful: Successfully Deleting a Question from a Quiz, then Checking QuizInfo', () => {
    expect(adminQuizQuestionDelete(token, quizId, questionId)).toStrictEqual({
      jsonBody: {},
      statusCode: 200,
    });
    expect(adminQuizInfo(token, quizId).jsonBody.questions).toStrictEqual([]);
  });

  test('Test Successful: Successfully Deleted a Question from a Quiz', () => {
    expect(adminQuizQuestionDelete(token, quizId, questionId)).toStrictEqual({
      jsonBody: {},
      statusCode: 200,
    });
  });

  test('Test Unsuccessful: User is not an owner of the quiz', () => {
    const session2 = adminAuthRegister('glhfh@gmail.com', 'glhf123111', 'abcd', 'efgh').jsonBody;
    expect(adminQuizQuestionDelete(session2.token, quizId, questionId)).toStrictEqual({
      jsonBody: {
        error: expect.any(String),
      },
      statusCode: 403,
    });
  });

  test.each([
    [''],
    ['123123'],
  ])('Test Unsuccessful: Token Invalid', (token) => {
    expect(adminQuizQuestionDelete(token, quizId, questionId)).toStrictEqual({
      jsonBody: {
        error: expect.any(String),
      },
      statusCode: 401,
    });
  });

  test('Test Unsuccessful: Quiz Id Invalid', () => {
    expect(adminQuizQuestionDelete(token, -1000000000, questionId)).toStrictEqual(
      {
        statusCode: 403,
        jsonBody: { error: expect.any(String) }
      }
    );
  });

  test.each([
    [-1],
    [123123],
  ])('Test Unsuccessful: Invalid QuestionId', (questionId) => {
    expect(adminQuizQuestionDelete(token, quizId, questionId)).toStrictEqual({
      jsonBody: {
        error: expect.any(String),
      },
      statusCode: 400,
    });
  });

  test('Test Unsuccessful: Invalid QuizId', () => {
    expect(adminQuizQuestionDelete(token, -1, questionId)).toStrictEqual({
      jsonBody: {
        error: expect.any(String),
      },
      statusCode: 403,
    });
  })
});
