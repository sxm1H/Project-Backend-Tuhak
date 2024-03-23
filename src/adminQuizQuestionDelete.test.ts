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
    const sessionId = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh').jsonBody;
    const quizId = adminQuizCreate(sessionId.token, 'Australian Cities', 'lorem ipsum').jsonBody;
    const questionId = adminQuizQuestionCreate(quizId.quizId, sessionId.token, 'Question1', 5, 5, [{answer: 'Melb', correct: true}, {answer: 'Syd', correct: false}]);
  });

  describe('Testing DELETE /v1/admin/quiz/:quizid/question/:questionid', () => {
    test('Test Successful: Successfully Deleted a Question from a Quiz', () => {
        expect(questionQuizQuestionDelete(sessionId.token, quizId.quizId, questionId.questionId)).toStrictEqual({
            jsonBody: {},
            statusCode: 200,
        })
    })

    test('Test Unsuccessful: User is not an owner of the quiz', () => {
        const session2 = adminAuthRegister('glhfh@gmail.com', 'glhf', 'abcd', 'efgh').jsonBody;
        expect(questionQuizQuestionDelete(session2.token, quizId.quizId, questionId.questionId)).toStrictEqual({
            jsonBody: {
                error: expect.any(String),
            },
            statusCode: 403,
        })
    })

    test.each([
        [''],
        ['123123'],
    ])('Test Unsuccessful: Token Invalid', (token) => {
        expect(questionQuizQuestionDelete(token, quizId.quizId, questionId.questionId)).toStrictEqual({
            jsonBody: {
                error: expect.any(String),
            },
            statusCode: 401,
        })
    })

    test.each([
        [-1],
        [123123],
    ])('Test Unsuccessful: Token Empty', (questionId) => {
        expect(questionQuizQuestionDelete(sessionId.token, quizId.quizId, questionId)).toStrictEqual({
            jsonBody: {
                error: expect.any(String),
            },
            statusCode: 400,
        })
    })



  })