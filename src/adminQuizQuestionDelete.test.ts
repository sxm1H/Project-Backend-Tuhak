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
    adminQuizDescriptionUpdate,
    adminQuizQuestionDelete,
    adminQuizQuestionCreate,
} from './testHelpers';

beforeEach(() => {
    clear();     
});

  describe('Testing DELETE /v1/admin/quiz/:quizid/question/:questionid', () => {
    let token: string;
    let quizId: number;
    let questionId: number;
    beforeEach(() => {
        token = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh').jsonBody.token;
        quizId = adminQuizCreate(token, 'Australian Cities', 'lorem ipsum').jsonBody.quizId;
        questionId = adminQuizQuestionCreate(quizId, token, 'Question1', 5, 5, [{answer: 'Melb', correct: true}, {answer: 'Syd', correct: false}]).jsonBody.questionId;
    })
    test('Test Successful: Successfully Deleted a Question from a Quiz', () => {
        expect(adminQuizQuestionDelete(token, quizId, questionId)).toStrictEqual({
            jsonBody: {},
            statusCode: 200,
        })
    })

    test('Test Unsuccessful: User is not an owner of the quiz', () => {
        const session2 = adminAuthRegister('glhfh@gmail.com', 'glhf123111', 'abcd', 'efgh').jsonBody;
        expect(adminQuizQuestionDelete(session2.token, quizId, questionId)).toStrictEqual({
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
        expect(adminQuizQuestionDelete(token, quizId, questionId)).toStrictEqual({
            jsonBody: {
                error: expect.any(String),
            },
            statusCode: 401,
        })
    })

    test.each([
        [-1],
        [123123],
    ])('Test Unsuccessful: Invalid QuestionId', (questionId) => {
        expect(adminQuizQuestionDelete(token, quizId, questionId)).toStrictEqual({
            jsonBody: {
                error: expect.any(String),
            },
            statusCode: 400,
        })
    })
})