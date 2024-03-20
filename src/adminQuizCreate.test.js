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

describe('adminQuizCreate', () => {
  test('User Id was not valid', () => {
    const userId = adminAuthRegister('somethin@gmail.com', 'validpassword123', 'Franz', 'Kafka');
    const createQuiz1 = adminQuizCreate(-1, 'amazing Quiz', 'the quiz Id is not a number');

    expect(createQuiz1.error).toEqual(expect.any(String));

    const createQuiz2 = adminQuizCreate(90000000, 'better Quiz', 'User id doesn\'t exist in the array');

    expect(createQuiz2.error).toEqual(expect.any(String));
  });

  test('Quiz name has invalid characters', () => {
    const userId1 = adminAuthRegister('somethin@gmail.com', 'validpassword123', 'Franz', 'Kafka');
    const createQuiz1 = adminQuizCreate(userId1.authUserId, '$:^)$', 'Quiz smile');

    expect(createQuiz1.error).toEqual(expect.any(String));

    const createQuiz2 = adminQuizCreate(userId1.authUserId, '(^___^)@b', 'Quiz Thumbsup');

    expect(createQuiz2.error).toEqual(expect.any(String));

    const createQuiz3 = adminQuizCreate(userId1.authUserId, '%%%%%%%%%', 'percentage Quiz');

    expect(createQuiz3.error).toEqual(expect.any(String));
  });

  test('Check Quiz name is between valid character limit', () => {
    const userId1 = adminAuthRegister('another@gmail.com', 'validpassword12367', 'Ludwig', 'Beethoven');
    const createQuiz1 = adminQuizCreate(userId1.authUserId, 'AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH',
      'Loud screaming is too long');

    expect(createQuiz1.error).toEqual(expect.any(String));

    const createQuiz2 = adminQuizCreate(userId1.authUserId, 'um', 'Quiz is unsure');

    expect(createQuiz2.error).toEqual(expect.any(String));

    const createQuiz3 = adminQuizCreate(userId1.authUserId, ' ', 'Blank quiz');

    expect(createQuiz3.error).toEqual(expect.any(String));
  });

  test('Check if Quiz Name already exists', () => {
    const userId1 = adminAuthRegister('cool@gmail.com', 'Thebestpassword123', 'Isaac', 'Newton');
    const createQuiz1 = adminQuizCreate(userId1.authUserId, 'Cool Quiz', 'The best quiz in the world');
    const createQuiz2 = adminQuizCreate(userId1.authUserId, 'Cool Quiz', 'Another cool quiz');

    expect(createQuiz2.error).toEqual(expect.any(String));
  });

  test('Quiz Description is too long', () => {
    const userId1 = adminAuthRegister('Fake@gmail.com', 'passwordpassword123', 'first', 'last');
    const createQuiz1 = adminQuizCreate(userId1.authUserId, 'Too Long', 'Lorem ipsum dolor sit amet. Eos deleniti inventore est illo eligendi ut excepturi molestiae aut vero quas. Et dolorum doloremque ad reprehenderit adipisci qui voluptatem harum');

    expect(createQuiz1.error).toEqual(expect.any(String));
  });

  test('Successful Quiz Created', () => {
    const userId1 = adminAuthRegister('fakerT1@gmail.com', 'pass123word', 'Smith', 'John');
    const createQuiz1 = adminQuizCreate(userId1.authUserId, 'good name', 'descriptive description');

    expect(createQuiz1.quizId).toStrictEqual(expect.any(Number));

    const createQuiz2 = adminQuizCreate(userId1.authUserId, 'blank quiz', '');

    expect(createQuiz2.quizId).toStrictEqual(expect.any(Number));
  });
});
