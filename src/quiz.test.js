import {expect, jest, test} from '@jest/globals';
import {adminAuthRegister} from './auth.js';
import {adminQuizNameUpdate, adminQuizRemove, adminQuizList, adminQuizInfo, adminAuizCreate, adminQuizDescriptionUpdate, adminQuizCreate} from './quiz.js';
import {clear} from './other.js';
import {getData, setData} from './dataStore.js';

beforeEach(() => {
  clear();
})

describe('adminQuizNameUpdate', () => {
  test('Successful test case', () => {
      let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
      
      let quiz = adminQuizCreate(userReg.authUserId, 'QuizName', 'QuizDescription');

      expect(adminQuizNameUpdate(userReg.authUserId, quiz.quizId, 'newName')).toBe({ });
  });
  test('AuthUserId is not a valid user', () => {

    let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
      
    let quiz = adminQuizCreate(userReg.authUserId, 'QuizName', 'QuizDescription');

    // 1234 being not a valid authUserId
    expect(adminQuizNameUpdate(1234, quiz.quizId, 'newName')).toBe({error: 'AuthUserId is not a valid user.'}); 
  });
  test('Quiz ID does not refer to a valid quiz.', () => {

    let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
      
    let quiz = adminQuizCreate(userReg.authUserId, 'QuizName', 'QuizDescription');

    // 1234 being not a valid quizId
    expect(adminQuizNameUpdate(userReg.authUserId, quiz.quizId, 'newName')).toBe({error: 'Quiz ID does not refer to a valid quiz.'}); 
  });
  test('Name contains invalid characters. Valid characters are alphanumeric and spaces.', () => {

    let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
      
    let quiz = adminQuizCreate(userReg.authUserId, 'QuizName', 'QuizDescription');

    // 🚫 is an emoji, therefore a invalid character
    expect(adminQuizNameUpdate(userReg.authUserId, quiz.quizId, '🚫')).toBe({error: 'Name contains invalid characters. Valid characters are alphanumeric and spaces.'}); 
  });
  test('Name is either less than 3 characters long or more than 30 characters long.', () => {

    let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
      
    let quiz = adminQuizCreate(userReg.authUserId, 'QuizName', 'QuizDescription');

    // bb is only two characters long
    expect(adminQuizNameUpdate(userReg.authUserId, quiz.quizId, 'bb')).toBe({error: 'Name is either less than 3 characters long or more than 30 characters long.'}); 
  });
  test('Name is either less than 3 characters long or more than 30 characters long.', () => {

    let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
      
    let quiz = adminQuizCreate(userReg.authUserId, 'QuizName', 'QuizDescription');

    // bb is 31 characters characters long
    expect(adminQuizNameUpdate(userReg.authUserId, quiz.quizId, 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')).toBe({error: 'Name is either less than 3 characters long or more than 30 characters long.'}); 
  });
  test('Name is already used by the current logged in user for another quiz.', () => {

    let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    let quizDuplicate = adminQuizCreate(userReg.authUserId, 'duplicateName', 'quizDuplicateDescription');
    let quiz = adminQuizCreate(userReg.authUserId, 'duplicateName', 'quizDescription');


    // duplicateName is already used
    expect(adminQuizNameUpdate(userReg.authUserId, quiz.quizId, 'duplicateName')).toBe({error: 'Name is already used by the current logged in user for another quiz.'}); 
  });
});

describe('adminQuizList', () => {
	test('Non valid User Id', () => {
		let quizList1 = adminQuizList(999999999999999);
		expect(quizList1.error).toEqual(expect.any(String));
		let quizList2 = adminQuizList(-1);
		expect(quizList2.error).toEqual(expect.any(String));
		let userId = adminAuthRegister('pain@gmail.com', 'Wowowowow123', 'Alex', 'Hirsch');
		let quizList3 = adminQuizList(userId.authUserId + 1)
		expect(quizList3.error).toEqual(expect.any(String));
	})

	test('User Id Quiz List successfully accessed', () => {
		let userId = adminAuthRegister("pogchamp@gmail.com", 'thisisvalidpassword1', 'Steve', 'Jobs');
		let quizListEmpty = adminQuizList(userId.authUserId);
		
		expect(quizListEmpty).toStrictEqual({
			quizzes: []
		});

		let quizId = adminQuizCreate(userId.authUserId, 'creative name', 'description');
		let quizList = adminQuizList(userId.authUserId);
		expect(quizList).toStrictEqual({
			quizzes: [
				{
					quizId: quizId.quizId,
					name: 'creative name'
				}
			]
		})
	})
})

describe ("adminQuizCreate", () => {
	test("User Id was not valid", () => {
		let userId = adminAuthRegister("somethin@gmail.com", "validpassword123", "Franz", "Kafka");
		let createQuiz1 = adminQuizCreate(-1, "amazing Quiz", "the quiz Id is not a number");
		expect(createQuiz1.error).toEqual(expect.any(String));
		let createQuiz2 = adminQuizCreate(90000000, "better Quiz", "User id doesn't exist in the array");
		expect(createQuiz2.error).toEqual(expect.any(String));
	})
	
	test("Quiz name has invalid characters", () => {
		let userId1 = adminAuthRegister("somethin@gmail.com", "validpassword123", "Franz", "Kafka");
		let createQuiz1 = adminQuizCreate(userId1.authUserId, "$:^)$", "Quiz smile");
		expect(createQuiz1.error).toEqual(expect.any(String));
		let createQuiz2 = adminQuizCreate(userId1.authUserId, "(^___^)@b", "Quiz Thumbsup");
		expect(createQuiz2.error).toEqual(expect.any(String));
		let createQuiz3 = adminQuizCreate(userId1.authUserId, "%%%%%%%%%", "percentage Quiz");
		expect(createQuiz3.error).toEqual(expect.any(String));
	})
	
	test("Check Quiz name is between valid character limit", () => {
		let userId1 = adminAuthRegister("another@gmail.com", "validpassword12367", "Ludwig", "Beethoven");
		let createQuiz1 = adminQuizCreate(userId1.authUserId, "AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH",
		"Loud screaming is too long");
		expect(createQuiz1.error).toEqual(expect.any(String));
		let createQuiz2 = adminQuizCreate(userId1.authUserId, "um", "Quiz is unsure");
		expect(createQuiz2.error).toEqual(expect.any(String));
		let createQuiz3 = adminQuizCreate(userId1.authUserId, " ", "Blank quiz");
		expect(createQuiz3.error).toEqual(expect.any(String));
	})
	
	test("Check if Quiz Name already exists", () => {
		let userId1 = adminAuthRegister("cool@gmail.com", "Thebestpassword123", "Isaac", "Newton");
		let createQuiz1 = adminQuizCreate(userId1.authUserId, "Cool Quiz", "The best quiz in the world");
		let createQuiz2 = adminQuizCreate(userId1.authUserId, "Cool Quiz", "Another cool quiz");
		expect(createQuiz2.error).toEqual(expect.any(String));
	})
	
	test("Quiz Description is too long", () => {
		let userId1 = adminAuthRegister("Fake@gmail.com", "passwordpassword123", "first", "last");
		let createQuiz1 = adminQuizCreate(userId1.authUserId, "Too Long","Lorem ipsum dolor sit amet. Eos deleniti inventore est illo eligendi ut excepturi molestiae aut vero quas. Et dolorum doloremque ad reprehenderit adipisci qui voluptatem harum");
		expect(createQuiz1.error).toEqual(expect.any(String));
	})
	
	test("Successful Quiz Created", () => {
		let userId1 = adminAuthRegister("fakerT1@gmail.com", "pass123word", "Smith", "John");
		let createQuiz1 = adminQuizCreate(userId1.authUserId, "good name", "descriptive description");
		expect(createQuiz1.quizId).toStrictEqual(expect.any(Number));
		let createQuiz2 = adminQuizCreate(userId1.authUserId, "blank quiz", "");
		expect(createQuiz2.quizId).toStrictEqual(expect.any(Number));
	})    
})


