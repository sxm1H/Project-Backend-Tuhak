import {expect, jest, test} from '@jest/globals';
import {adminAuthRegister} from "./auth.js";
import {clear} from "./other.js";
import {adminQuizCreate} from "./quiz.js";

beforeEach(() => {
	clear();
})

describe ("adminQuizCreate", () => {
	test("User Id was not valid", () => {
		let userId = adminAuthRegister("somethin@gmail.com", "validpassword123", "Franz", "Kafka");
		let createQuiz1 = adminQuizCreate(-1, "amazing Quiz", "the quiz Id is not a number");
		expect(createQuiz1).toStrictEqual({error: "User Id is not valid"});
		let createQuiz2 = adminQuizCreate(90000000, "better Quiz", "User id doesn't exist in the array");
		expect(createQuiz2).toStrictEqual({error: "User Id is not valid"});
	})
	
	test("Quiz name has invalid characters", () => {
		let userId1 = adminAuthRegister("somethin@gmail.com", "validpassword123", "Franz", "Kafka");
		let createQuiz1 = adminQuizCreate(userId1.authUserId, "$:^)$", "Quiz smile");
		expect(createQuiz1).toStrictEqual({error: "Quiz Name contains invalid characters"});
		let createQuiz2 = adminQuizCreate(userId1.authUserId, "(^___^)@b", "Quiz Thumbsup");
		expect(createQuiz2).toStrictEqual({error: "Quiz Name contains invalid characters"});
		let createQuiz3 = adminQuizCreate(userId1.authUserId, "%%%%%%%%%", "percentage Quiz");
		expect(createQuiz3).toStrictEqual({error: "Quiz Name contains invalid characters"});
	})
	
	test("Check Quiz name is bettween valid character limit", () => {
		let userId1 = adminAuthRegister("another@gmail.com", "validpassword12367", "Ludwig", "Beethoven");
		let createQuiz1 = adminQuizCreate(userId1.authUserId, "AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH",
		"Loud screaming is too long");
		expect(createQuiz1).toStrictEqual({error:"Quiz Name must be more than 2 chracters and less than 31 characters long"});
		let createQuiz2 = adminQuizCreate(userId1.authUserId, "um", "Quiz is unsure");
		expect(createQuiz2).toStrictEqual({error:"Quiz Name must be more than 2 chracters and less than 31 characters long"});
		let createQuiz3 = adminQuizCreate(userId1.authUserId, " ", "Blank quiz");
		expect(createQuiz3).toStrictEqual({error:"Quiz Name must be more than 2 chracters and less than 31 characters long"});
	})
	
	test("Check if Quiz Name already exists", () => {
		let userId1 = adminAuthRegister("cool@gmail.com", "Thebestpassword123", "Isaac", "Newton");
		let createQuiz1 = adminQuizCreate(userId1.authUserId, "Cool Quiz", "The best quiz in the world");
		let createQuiz2 = adminQuizCreate(userId1.authUserId, "Cool Quiz", "Another cool quiz");
		expect(createQuiz2).toStrictEqual({error: "Quiz name already in use"});
	})
	
	test("Quiz Description is too long", () => {
		let userId1 = adminAuthRegister("Fake@gmail.com", "passwordpassword123", "first", "last");
		let createQuiz1 = adminQuizCreate(userId1.authUserId, "Too Long","Lorem ipsum dolor sit amet. Eos deleniti inventore est illo eligendi ut excepturi molestiae aut vero quas. Et dolorum doloremque ad reprehenderit adipisci qui voluptatem harum");
		expect(createQuiz1).toStrictEqual({error: "Description is more than 100 characters"});
	})
	
	test("Successful Quiz Created", () => {
		let userId1 = adminAuthRegister("fakerT1@gmail.com", "pass123word", "Smith", "John");
		let createQuiz1 = adminQuizCreate(userId1.authUserId, "good name", "descriptive description");
		expect(createQuiz1.quizId).toStrictEqual(expect.any(Number));
		let createQuiz2 = adminQuizCreate(userId1.authUserId, "blank quiz", "");
		expect(createQuiz2.quizId).toStrictEqual(expect.any(Number));
	})    
})
