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

describe('Testing POST /v1/admin/quiz/:quizid/question', () => {
    beforeEach(() => {
        const sessionId = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh').jsonBody;
        const quizId = adminQuizCreate(sessionId.token, 'Australian Cities', 'lorem ipsum').jsonBody;
    })

    test.each([
        ['What is the best city in Australia', 4, 5, [{answer: 'Sydney', correct: true}, {answer: 'Melbourne', correct: false}]],
        ['What is the best city in Australia', 4, 5, [{answer: 'Sydney', correct: true}, {answer: 'Melbourne', correct: false}]],
    ])('Test Successful: Creating a Question with One or More Answers', () => {
        expect(adminQuizCreateQuestion(sessionId.token, duration, points, answers)).toStrictEqual({
            jsonBody: {
                questionId: expect.any(Number),
            },
            statusCode: 200,
        })
    })

    test.each([
        ['Q?', 4, 5, [{answer: 'Sydney', correct: true}, {answer: 'Melbourne', correct: false}]],
        ['lorem ' * 50, 4, 5, [{answer: 'Sydney', correct: true}, {answer: 'Melbourne', correct: false}]],
    ])('Test Unsuccessful: Question length is not between 5 and 50 characters', (question, duration, points, answers)=> {
        expect(adminQuizCreateQuestion(quizId.quizId, sessionId.token, question, duration, points, answers)).toStrictEqual({
            jsonBody: {
                error: expect.any(error),
            },
            statusCode: 400,
        })
    })

    test.each([
        ['What is the best city in Australia', 4, 5, [
            {answer: 'Sydney', correct: true}, 
            {answer: 'Melbourne', correct: false},
            {answer: 'Parramatta', correct: false}, 
            {answer: 'Brisbane', correct: false},
            {answer: 'Perth', correct: false}, 
            {answer: 'Geelong', correct: false},
            {answer: 'Gold Coast', correct: false},
        ]],
        ['What is the best city in Australia', 4, 5, [{answer: 'Sydney', correct: true}]],
    ])('Test Unsuccessful: Number of Answers Not Between 2 and 6', (question, duration, points, answers)=> {
        expect(adminQuizCreateQuestion(quizId.quizId, sessionId.token, question, duration, points, answers)).toStrictEqual({
            jsonBody: {
                error: expect.any(error),
            },
            statusCode: 400,
        })
    })

    test('Test Unsuccessful: Question Duration Negative', () => {
        const question = 'What is the best city in Australia';
        const points = 1;
        const answers = [{answer: 'Sydney', correct: true}, {answer: 'Melbourne', correct: false}]
        expect(adminQuizCreateQuestion(quizId.quizId, sessionId.token, question, -1, points, answers)).toStrictEqual({
            jsonBody: {
                error: expect.any(error),
            },
            statusCode: 400,
        })
    })

    test.each([
        ['What is the best city in Australia', 4, -1, [{answer: 'Sydney', correct: true}, {answer: 'Melbourne', correct: false}]],
        ['What is the best city in Australia', 4, 11, [{answer: 'Sydney', correct: true}, {answer: 'Melbourne', correct: false}]],
    ])('Test Unsuccessful: Points are not between 1 and 10', (question, duration, points, answers) => {
        expect(adminQuizCreateQuestion(quizId.quizId, sessionId.token, question, duration, points, answers)).toStrictEqual({
            jsonBody: {
                error: expect.any(error),
            },
            statusCode: 400,
        })
    })

    test.each([
        ['What is the best city in Australia', 4, 1, [{answer: '', correct: true}, {answer: 'Melbourne', correct: false}]],
        ['What is the best city in Australia', 4, 1, [{answer: 'Sydney', correct: true}, {answer: 'Melbourne' * 100, correct: false}]],
    ])('Test Unsuccessful: Length of answer is not between 1 and 30', (question, duration, points, answers) => {
        expect(adminQuizCreateQuestion(quizId.quizId, sessionId.token, question, duration, points, answers)).toStrictEqual({
            jsonBody: {
                error: expect.any(error),
            },
            statusCode: 400,
        })
    })

    test('Test Unsuccessful: Answer Options Are the Same', () => {
        const question = 'What is the best city in Australia';
        const duration = 5;
        const points = 1;
        const answers = [{answer: 'Sydney', correct: true}, {answer: 'Sydney', correct: false}]
        expect(adminQuizCreateQuestion(quizId.quizId, sessionId.token, question, duration, points, answers)).toStrictEqual({
            jsonBody: {
                error: expect.any(error),
            },
            statusCode: 400,
        })
    })

    test('Test Unsuccessful: No Correct Options', () => {
        const question = 'What is the best city in Australia';
        const duration = 5;
        const points = 1;
        const answers = [{answer: 'Sydney', correct: false}, {answer: 'Sydney', correct: true}]
        expect(adminQuizCreateQuestion(quizId.quizId, sessionId.token, question, duration, points, answers)).toStrictEqual({
            jsonBody: {
                error: expect.any(error),
            },
            statusCode: 400,
        })
    })

    test('Test Unsuccessful: Quiz Duration Exceed 3 Minutes.', () => {
        let answers = [{answer: 'Sydney', correct: false}, {answer: 'Sydney', correct: true}];

        expect(adminQuizCreateQuestion(quizId.quizId, sessionId.token, 'Question1', 100, 1, answers)).toStrictEqual({
            jsonBody: {
                questionId: expect.any(Number),
            },
            statusCode: 200,
        })

        answers = [{answer: 'Cricket', correct: false}, {answer: 'Football', correct: true}];
        expect(adminQuizCreateQuestion(quizId.quizId, sessionId.token, 'Question2', 81, 2, answers)).toStrictEqual({
            jsonBody: {
                error: expect.any(error),
            },
            statusCode: 400,
        })

    })

})