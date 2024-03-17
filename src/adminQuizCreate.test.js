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

describe ('adminQuizCreate', () => {

  test('User Id was not valid', () => {
    let userId = adminAuthRegister('somethin@gmail.com', 'validpassword123', 'Franz', 'Kafka');
    let createQuiz1 = adminQuizCreate(-1, 'amazing Quiz', 'the quiz Id is not a number');

    expect(createQuiz1.error).toEqual(expect.any(String));
    
    let createQuiz2 = adminQuizCreate(90000000, 'better Quiz', 'User id doesn\'t exist in the array');
    
    expect(createQuiz2.error).toEqual(expect.any(String));
  });
	
  test('Quiz name has invalid characters', () => {
    let userId1 = adminAuthRegister('somethin@gmail.com', 'validpassword123', 'Franz', 'Kafka');
    let createQuiz1 = adminQuizCreate(userId1.authUserId, '$:^)$', 'Quiz smile');
    
    expect(createQuiz1.error).toEqual(expect.any(String));
    
    let createQuiz2 = adminQuizCreate(userId1.authUserId, '(^___^)@b', 'Quiz Thumbsup');
    
    expect(createQuiz2.error).toEqual(expect.any(String));
    
    let createQuiz3 = adminQuizCreate(userId1.authUserId, '%%%%%%%%%', 'percentage Quiz');
    
    expect(createQuiz3.error).toEqual(expect.any(String));
  });
	
  test('Check Quiz name is between valid character limit', () => {
    let userId1 = adminAuthRegister('another@gmail.com', 'validpassword12367', 'Ludwig', 'Beethoven');
    let createQuiz1 = adminQuizCreate(userId1.authUserId, 'AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH',
      'Loud screaming is too long');
      
    expect(createQuiz1.error).toEqual(expect.any(String));
    
    let createQuiz2 = adminQuizCreate(userId1.authUserId, 'um', 'Quiz is unsure');
    
    expect(createQuiz2.error).toEqual(expect.any(String));
    
    let createQuiz3 = adminQuizCreate(userId1.authUserId, ' ', 'Blank quiz');
    
    expect(createQuiz3.error).toEqual(expect.any(String));
  });
	
  test('Check if Quiz Name already exists', () => {
    let userId1 = adminAuthRegister('cool@gmail.com', 'Thebestpassword123', 'Isaac', 'Newton');
    let createQuiz1 = adminQuizCreate(userId1.authUserId, 'Cool Quiz', 'The best quiz in the world');
    let createQuiz2 = adminQuizCreate(userId1.authUserId, 'Cool Quiz', 'Another cool quiz');
    
    expect(createQuiz2.error).toEqual(expect.any(String));
  });
	
  test('Quiz Description is too long', () => {
    let userId1 = adminAuthRegister('Fake@gmail.com', 'passwordpassword123', 'first', 'last');
    let createQuiz1 = adminQuizCreate(userId1.authUserId, 'Too Long','Lorem ipsum dolor sit amet. Eos deleniti inventore est illo eligendi ut excepturi molestiae aut vero quas. Et dolorum doloremque ad reprehenderit adipisci qui voluptatem harum');
    
    expect(createQuiz1.error).toEqual(expect.any(String));
  });
	
  test('Successful Quiz Created', () => {
    let userId1 = adminAuthRegister('fakerT1@gmail.com', 'pass123word', 'Smith', 'John');
    let createQuiz1 = adminQuizCreate(userId1.authUserId, 'good name', 'descriptive description');
    
    expect(createQuiz1.quizId).toStrictEqual(expect.any(Number));
    
    let createQuiz2 = adminQuizCreate(userId1.authUserId, 'blank quiz', '');
    
    expect(createQuiz2.quizId).toStrictEqual(expect.any(Number));
  });    
});