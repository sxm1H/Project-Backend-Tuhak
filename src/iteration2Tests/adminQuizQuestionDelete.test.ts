import {
  clear,
  adminAuthRegister,
  adminQuizCreate,
  adminQuizQuestionDelete,
  adminQuizQuestionCreate,
  adminQuizInfo,
} from './testHelpers';
import HTTPError from 'http-errors';
let token: string;
let quizId: number;
let questionId: number;
beforeEach(() => {
  clear();

  token = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh').token;
  quizId = adminQuizCreate(token, 'Australian Cities', 'lorem ipsum').quizId;
  questionId = adminQuizQuestionCreate(quizId, token, 'Question1', 5, 5, [{ answer: 'Melb', correct: true }, { answer: 'Syd', correct: false }]).questionId;
});

describe('Testing DELETE /v1/admin/quiz/:quizid/question/:questionid', () => {
  test('Comprehensive Test Successful: Successfully Deleting a Question from a Quiz, then Checking QuizInfo', () => {
    expect(adminQuizQuestionDelete(token, quizId, questionId)).toStrictEqual({

    });
    expect(adminQuizInfo(token, quizId).questions).toStrictEqual([]);
  });

  test('Test Successful: Successfully Deleted a Question from a Quiz', () => {
    expect(adminQuizQuestionDelete(token, quizId, questionId)).toStrictEqual({

    });
  });

  test('Test Unsuccessful: User is not an owner of the quiz', () => {
    const session2 = adminAuthRegister('glhfh@gmail.com', 'glhf123111', 'abcd', 'efgh');
    expect(() => adminQuizQuestionDelete(session2.token, quizId, questionId)).toThrow(HTTPError[403]);
  });

  test.each([
    [''],
    ['123123'],
  ])('Test Unsuccessful: Token Invalid', (token) => {
    expect(() => adminQuizQuestionDelete(token, quizId, questionId)).toThrow(HTTPError[401]);
  });

  test('Test Unsuccessful: Quiz Id Invalid', () => {
    expect(() => adminQuizQuestionDelete(token, -1000000000, questionId)).toThrow(HTTPError[403]);
  });

  test.each([
    [-1],
    [123123],
  ])('Test Unsuccessful: Invalid QuestionId', (questionId) => {
    expect(() => adminQuizQuestionDelete(token, quizId, questionId)).toThrow(HTTPError[400]);
  });

  test('Test Unsuccessful: Invalid QuizId', () => {
    expect(() => adminQuizQuestionDelete(token, -1, questionId)).toThrow(HTTPError[403]);
  });
});
