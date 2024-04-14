import {
  clear,
  adminAuthRegister,
  adminQuizCreate,
  adminQuizRemove,
  adminQuizList,
} from './testHelpers';
import HTTPError from 'http-errors';

let token: string;
let quizId: number;
beforeEach(() => {
  clear();

  token = adminAuthRegister('nick@gmail.com', 'nick1234', 'Nicholas', 'Sebastian').token;
  quizId = adminQuizCreate(token, 'Cities of Australia', 'good quiz').quizId;
});

describe('adminQuizRemove', () => {
  test('Successful test', () => {
    expect(adminQuizRemove(token, quizId)).toStrictEqual({});
  });

  test('authUserId is not a valid user', () => {
    expect(() => adminQuizRemove(token + 'hello', quizId)).toThrow(HTTPError[401]);
  });

  test('QuizId is not a valid quiz.', () => {
    expect(() => adminQuizRemove(token, 1234)).toThrow(HTTPError[403]);
  });

  test('Quiz ID does not refer to a quiz that this user owns.', () => {
    const token1 = adminAuthRegister('DunYao@gmail.com', 'DunYao1234', 'DunYao', 'Foo').token;

    expect(() => adminQuizRemove(token1, quizId)).toThrow(HTTPError[403]);
  });

  test('Successful quiz remove - comprehensive test', () => {
    expect(adminQuizList(token)).toStrictEqual({
      quizzes: [
        {
          quizId: quizId,
          name: 'Cities of Australia'
        }
      ]
    });

    const quizId2 = adminQuizCreate(token, 'i will be gone soon', 'goodbye').quizId;

    expect(adminQuizList(token)).toStrictEqual({
        quizzes: [
          {
            quizId: quizId,
            name: 'Cities of Australia'
          },
          {
            quizId: quizId2,
            name: 'i will be gone soon'
          }
        ]
    });

    expect(adminQuizRemove(token, quizId2)).toStrictEqual({});

    expect(adminQuizList(token)).toStrictEqual({
        quizzes: [
          {
            quizId: quizId,
            name: 'Cities of Australia'
          }
        ]
    });
  });

  test('Test Unsuccessful: Invalid Quiz Id', () => {
    expect(() => adminQuizRemove(token, -1)).toThrow(HTTPError[403]);
  });
});
