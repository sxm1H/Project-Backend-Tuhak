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

      expect(adminQuizNameUpdate(userReg.authUserId, quiz.quizId, 'newName')).toEqual({});

  });
  test('AuthUserId is not a valid user', () => {

    let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
      
    let quiz = adminQuizCreate(userReg.authUserId, 'QuizName', 'QuizDescription');

    let error = adminQuizNameUpdate(1234, quiz.quizId, 'newName')

    // 1234 being not a valid authUserId
    expect(error.error).toEqual(expect.any(String)); 
  });
  test('Quiz ID does not refer to a valid quiz.', () => {

    let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
      
    let quiz = adminQuizCreate(userReg.authUserId, 'QuizName', 'QuizDescription');

    let error = adminQuizNameUpdate(userReg.authUserId, 1234, 'newName');

    // 1234 being not a valid quizId
    expect(error.error).toEqual(expect.any(String)); 
  });
  test('Name contains invalid characters. Valid characters are alphanumeric and spaces.', () => {

    let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
      
    let quiz = adminQuizCreate(userReg.authUserId, 'QuizName', 'QuizDescription');

    let error = adminQuizNameUpdate(userReg.authUserId, quiz.quizId, '🚫')

    // 🚫 is an emoji, therefore a invalid character
    expect(error.error).toEqual(expect.any(String)); 
  });
  test('Name is either less than 3 characters long or more than 30 characters long.', () => {

    let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
      
    let quiz = adminQuizCreate(userReg.authUserId, 'QuizName', 'QuizDescription');

    let error = adminQuizNameUpdate(userReg.authUserId, quiz.quizId, 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')

    // bb is only two characters long
    expect(error.error).toEqual(expect.any(String)); 
  });
  test('Name is either less than 3 characters long or more than 30 characters long.', () => {

    let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
      
    let quiz = adminQuizCreate(userReg.authUserId, 'QuizName', 'QuizDescription');

    let error = adminQuizNameUpdate(userReg.authUserId, quiz.quizId, 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')
    // bb is 31 characters characters long
    expect(error.error).toEqual(expect.any(String)); 
  });
  test('Name is already used by the current logged in user for another quiz.', () => {

    let userReg = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    let quizDuplicate = adminQuizCreate(userReg.authUserId, 'duplicateName', 'quizDuplicateDescription');
    let quiz = adminQuizCreate(userReg.authUserId, 'duplicateName', 'quizDescription');

    let error = adminQuizNameUpdate(userReg.authUserId, quiz.quizId, 'duplicateName')
    // duplicateName is already used
    expect(error.error).toEqual(expect.any(String)); 
  });
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

describe('adminQuizInfo', () => {

	let authUserId;
	let quizId;
	beforeEach(() => {
		authUserId = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
		quizId = adminQuizCreate(authUserId.authUserId, 'quiz1', 'lorem ipsum');
	});

	test('Success', () => {
		expect(adminQuizInfo(authUserId.authUserId, quizId.quizId)).toStrictEqual(
			{
				quizId: expect.any(Number),
				name: expect.any(String),
				timeCreated: expect.any(Number),
				timeLastEdited: expect.any(Number),
				description: expect.any(String),
			}
		);
	});

	test('Invalid AuthUserId', () => {
		let info = adminQuizInfo(-2, quizId.quizId);
		expect(info.error).toStrictEqual(expect.any(String));
	});

	test('Invalid quizId)', () => {
		let info = adminQuizInfo(authUserId.authUserId, -2);
		expect(info.error).toStrictEqual(expect.any(String));
	});

	test('User does not own quiz', () => {
		let authUserId2 = adminAuthRegister('sami@unsw.edu.au', '1234abcd', 'Sami', 'Hossain');
		let info = adminQuizInfo(authUserId2.authUserId, quizId.quizId);
		expect(info.error).toStrictEqual(expect.any(String));
	})
	
});