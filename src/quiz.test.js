import { adminQuizNameUpdate, adminQuizCreate } from './quiz.js';
import { adminAuthRegister } from './auth.js'
import { clear } from './other.js'

describe('adminQuizNameUpdate', () => {
  test('Successful test case', () => {
    clear();
      let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
      
      let quiz = adminQuizCreate(userReg.authUserId, 'QuizName', 'QuizDescription');

      expect(adminQuizNameUpdate(userReg.authUserId, quiz.quizId, 'newName')).toBe({ });
  });
  test('AuthUserId is not a valid user', () => {
    clear();

    let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
      
    let quiz = adminQuizCreate(userReg.authUserId, 'QuizName', 'QuizDescription');

    // 1234 being not a valid authUserId
    expect(adminQuizNameUpdate(1234, quiz.quizId, 'newName')).toBe({error: 'AuthUserId is not a valid user.'}); 
  });
  test('Quiz ID does not refer to a valid quiz.', () => {
    clear();

    let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
      
    let quiz = adminQuizCreate(userReg.authUserId, 'QuizName', 'QuizDescription');

    // 1234 being not a valid quizId
    expect(adminQuizNameUpdate(userReg.authUserId, quiz.quizId, 'newName')).toBe({error: 'Quiz ID does not refer to a valid quiz.'}); 
  });
  test('Name contains invalid characters. Valid characters are alphanumeric and spaces.', () => {
    clear();

    let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
      
    let quiz = adminQuizCreate(userReg.authUserId, 'QuizName', 'QuizDescription');

    // 🚫 is an emoji, therefore a invalid character
    expect(adminQuizNameUpdate(userReg.authUserId, quiz.quizId, '🚫')).toBe({error: 'Name contains invalid characters. Valid characters are alphanumeric and spaces.'}); 
  });
  test('Name is either less than 3 characters long or more than 30 characters long.', () => {
    clear();

    let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
      
    let quiz = adminQuizCreate(userReg.authUserId, 'QuizName', 'QuizDescription');

    // bb is only two characters long
    expect(adminQuizNameUpdate(userReg.authUserId, quiz.quizId, 'bb')).toBe({error: 'Name is either less than 3 characters long or more than 30 characters long.'}); 
  });
  test('Name is either less than 3 characters long or more than 30 characters long.', () => {
    clear();

    let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
      
    let quiz = adminQuizCreate(userReg.authUserId, 'QuizName', 'QuizDescription');

    // bb is 31 characters characters long
    expect(adminQuizNameUpdate(userReg.authUserId, quiz.quizId, 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')).toBe({error: 'Name is either less than 3 characters long or more than 30 characters long.'}); 
  });
  test('Name is already used by the current logged in user for another quiz.', () => {
    clear();

    let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    let quizDuplicate = adminQuizCreate(userReg.authUserId, 'duplicateName', 'quizDuplicateDescription');
    let quiz = adminQuizCreate(userReg.authUserId, 'duplicateName', 'quizDescription');


    // duplicateName is already used
    expect(adminQuizNameUpdate(userReg.authUserId, quiz.quizId, 'duplicateName')).toBe({error: 'Name is already used by the current logged in user for another quiz.'}); 
  });
});