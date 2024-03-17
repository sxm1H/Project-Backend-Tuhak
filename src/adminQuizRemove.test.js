import {adminAuthRegister} from './auth';
import {
  adminQuizNameUpdate,
  adminQuizRemove,
  adminQuizList,
  adminQuizInfo,
  adminQuizDescriptionUpdate,
  adminQuizCreate
} from './quiz';
import {clear} from './other';

beforeEach(() => {
  clear();
});

describe('adminQuizRemove', () => {

  test('Successful test', () => {
    let userId = adminAuthRegister('nick@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    let quiz = adminQuizCreate(userId.authUserId, 'Cities of Australia', 'good quiz');

    expect(adminQuizRemove(userId.authUserId, quiz.quizId)).toStrictEqual({ });
 });

  test('authUserId is not a valid user', () => {
    let userId = adminAuthRegister('nick@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    let quiz = adminQuizCreate(userId.authUserId, 'Cities of Australia', 'good quiz');
    let error = adminQuizRemove(1234, quiz.quizId); // 1234 being an obvious not authorised ID.

    expect(error.error).toEqual(expect.any(String));
  });

  test('QuizId is not a valid quiz.', () => {
    let userId = adminAuthRegister('nick@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    let error = adminQuizRemove(userId.authUserId, 1234); // 1234 being an obvious not authorised quizId.
  
    expect(error.error).toEqual(expect.any(String));
  });

  test('Quiz ID does not refer to a quiz that this user owns.', () => {
    let userId = adminAuthRegister('nick@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    let userId2 = adminAuthRegister('DunYao@gmail.com', 'DunYao1234', 'DunYao', 'Foo');
    let quiz = adminQuizCreate(userId.authUserId, 'Cities of Australia', 'good quiz'); // nick's quiz
    let error = adminQuizRemove(userId2.authUserId, quiz.quizId); // userId2 is Dun Yao
  
    expect(error.error).toEqual(expect.any(String));
  });

  test('Successful quiz remove - comprehensive test', () => {
    let userId = adminAuthRegister('nick@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    let quiz = adminQuizCreate(userId.authUserId, 'Cities of Australia', 'good quiz');
    let quizList = adminQuizList(userId.authUserId);

    expect(quizList).toStrictEqual({
      quizzes: [
        {
          quizId: quiz.quizId,
          name: 'Cities of Australia'
        }
      ]
    });

    let quizToDelete = adminQuizCreate(userId.authUserId, 'i will be gone soon', 'goodbye');
    quizList = adminQuizList(userId.authUserId);

    expect(quizList).toStrictEqual({
      quizzes: [
        {
          quizId: quiz.quizId,
          name: 'Cities of Australia'
        },
        {
          quizId: quizToDelete.quizId,
          name: 'i will be gone soon'
        }
      ]
    });

    expect(adminQuizRemove(userId.authUserId, quizToDelete.quizId)).toStrictEqual({ });

    quizList = adminQuizList(userId.authUserId);
    
    expect(quizList).toStrictEqual({
      quizzes: [
        {
          quizId: quiz.quizId,
          name: 'Cities of Australia'
        }
      ]
    });
  });
});