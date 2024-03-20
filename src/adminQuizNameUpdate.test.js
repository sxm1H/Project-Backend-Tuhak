import { clear } from './other';
import { adminAuthRegister } from './auth';
import {
  adminQuizNameUpdate,
  adminQuizRemove,
  adminQuizList,
  adminQuizInfo,
  adminQuizDescriptionUpdate,
  adminQuizCreate
} from './quiz';
import {
  requestHelper,
  clear,
  adminAuthRegister,
  adminAuthLogin,
  adminUserDetails,
  adminUserDetailsUpdate,
  adminUserPasswordUpdate,
  adminQuizList,
  adminQuizCreate,
  adminQuizRemove,
  adminQuizInfo,
  adminQuizNameUpdate,
  adminQuizDescriptionUpdate
} from './testHelpers';

beforeEach(() => {
  clear();
});

describe('adminQuizNameUpdate', () => {
  test('Successful test case', () => {
    const userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const quiz = adminQuizCreate(userReg.authUserId, 'QuizName', 'QuizDescription');

    expect(adminQuizNameUpdate(userReg.authUserId, quiz.quizId, 'newName')).toEqual({});
  });

  test('Comprehensive successful test case', () => {
    const userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const quiz = adminQuizCreate(userReg.authUserId, 'QuizName', 'QuizDescription');
    let quizList = adminQuizList(userReg.authUserId);

    expect(quizList).toStrictEqual({
      quizzes: [
        {
          quizId: quiz.quizId,
          name: 'QuizName'
        }
      ]
    });

    const quiz2 = adminQuizCreate(userReg.authUserId, 'new quiz hello', 'hihihihi');

    expect(adminQuizNameUpdate(userReg.authUserId, quiz.quizId, 'newName')).toEqual({});
    quizList = adminQuizList(userReg.authUserId);
    expect(quizList).toStrictEqual({
      quizzes: [
        {
          quizId: quiz.quizId,
          name: 'newName'
        },
        {
          quizId: quiz2.quizId,
          name: 'new quiz hello'
        }
      ]
    });

    expect(adminQuizNameUpdate(userReg.authUserId, quiz2.quizId, 'omg new name')).toEqual({});
    quizList = adminQuizList(userReg.authUserId);
    expect(quizList).toStrictEqual({
      quizzes: [
        {
          quizId: quiz.quizId,
          name: 'newName'
        },
        {
          quizId: quiz2.quizId,
          name: 'omg new name'
        }
      ]
    });
  });

  test('AuthUserId is not a valid user', () => {
    const userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const quiz = adminQuizCreate(userReg.authUserId, 'QuizName', 'QuizDescription');
    const error = adminQuizNameUpdate(1234, quiz.quizId, 'newName');

    // 1234 being not a valid authUserId
    expect(error.error).toEqual(expect.any(String));
  });

  test('Quiz ID does not refer to a valid quiz.', () => {
    const userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const quiz = adminQuizCreate(userReg.authUserId, 'QuizName', 'QuizDescription');
    const error = adminQuizNameUpdate(userReg.authUserId, 1234, 'newName');

    // 1234 being not a valid quizId
    expect(error.error).toEqual(expect.any(String));
  });

  test('Name contains invalid characters. Valid characters are alphanumeric and spaces.', () => {
    const userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const quiz = adminQuizCreate(userReg.authUserId, 'QuizName', 'QuizDescription');
    const error = adminQuizNameUpdate(userReg.authUserId, quiz.quizId, '🚫');

    // 🚫 is an emoji, therefore a invalid character
    expect(error.error).toEqual(expect.any(String));
  });

  test('Name is either less than 3 characters long or more than 30 characters long.', () => {
    const userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const quiz = adminQuizCreate(userReg.authUserId, 'QuizName', 'QuizDescription');
    const error = adminQuizNameUpdate(userReg.authUserId, quiz.quizId, 'bb');

    // bb is only two characters long
    expect(error.error).toEqual(expect.any(String));
  });

  test('Name is either less than 3 characters long or more than 30 characters long.', () => {
    const userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const quiz = adminQuizCreate(userReg.authUserId, 'QuizName', 'QuizDescription');
    const error = adminQuizNameUpdate(userReg.authUserId, quiz.quizId, 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
    // bb is 31 characters characters long

    expect(error.error).toEqual(expect.any(String));
  });

  test('Name is already used by the current logged in user for another quiz.', () => {
    const userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const quizDuplicate = adminQuizCreate(userReg.authUserId, 'duplicateName', 'quizDuplicateDescription');
    const quiz = adminQuizCreate(userReg.authUserId, 'duplicateName', 'quizDescription');
    const error = adminQuizNameUpdate(userReg.authUserId, quiz.quizId, 'duplicateName');
    // duplicateName is already used

    expect(error.error).toEqual(expect.any(String));
  });
});
