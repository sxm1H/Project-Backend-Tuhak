import {
  clear,
  adminAuthRegister,
  adminQuizCreate,
  adminQuizInfo,
  adminQuizQuestionCreate,
  adminQuizQuestionUpdate,
} from './testHelpers';

beforeEach(() => {
  clear();
});

describe('Testing POST /v1/admin/quiz/:quizid/question', () => {
  let token: string;
  let quizId: number;
  let questionId: number;
  beforeEach(() => {
    token = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh').jsonBody.token;
    quizId = adminQuizCreate(token, 'Australian Cities', 'lorem ipsum').jsonBody.quizId;
    questionId = adminQuizQuestionCreate(quizId, token, 'What is the best city in Australia', 4, 5, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }]).jsonBody.questionId;
  });

  test('Test Successful: Successfully Updating One Question', () => {
    const question = 'What is the best things to do in your spare time';
    const duration = 4;
    const points = 10;
    const answers = [{
      answer: 'Valorant',
      correct: true,
    },
    {
      answer: 'Video Games',
      correct: false,
    }];
    expect(adminQuizQuestionUpdate(question, duration, points, answers, token, quizId, questionId)).toStrictEqual({
      jsonBody: { },
      statusCode: 200,
    });
  });

  test('Comprehensive Test Successful: Successfully Updating One Question and Checking QuizInfo', () => {
    const question = 'What is the best things to do in your spare time';
    const duration = 4;
    const points = 10;
    const answers = [{
      answer: 'Valorant',
      correct: true,
    },
    {
      answer: 'Video Games',
      correct: false,
    }];

    expect(adminQuizQuestionUpdate(question, duration, points, answers, token, quizId, questionId)).toStrictEqual({
      jsonBody: { },
      statusCode: 200,
    });

    expect(adminQuizInfo(token, quizId)).toStrictEqual({
      jsonBody: {
        quizId: quizId,
        name: 'Australian Cities',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'lorem ipsum',
        duration: duration,
        numQuestions: 1,
        questions: [
          {
            questionId: questionId,
            question: question,
            duration: duration,
            points: points,
            answers: [
              {
                answerId: expect.any(Number),
                answer: 'Valorant',
                correct: true,
              },
              {
                answerId: expect.any(Number),
                answer: 'Video Games',
                correct: false,
              }
            ],
          }
        ]
      },
      statusCode: 200,
    });
  });

  test('Comprehensive Test Successful: Creating Multiple Questions, Updating them Simultaneously, then checking QuizInfo', () => {
    const questionId2 = adminQuizQuestionCreate(quizId, token, 'Question2', 4, 5, [{ answer: 'Hello', correct: true }, { answer: 'Bye', correct: false }]).jsonBody.questionId;
    const questionId3 = adminQuizQuestionCreate(quizId, token, 'Question3', 4, 5, [{ answer: 'lorem', correct: true }, { answer: 'ispum', correct: false }]).jsonBody.questionId;
    const questionId4 = adminQuizQuestionCreate(quizId, token, 'Question3', 4, 5, [{ answer: 'answer1', correct: true }, { answer: 'answer2', correct: false }]).jsonBody.questionId;

    const duration = 4;
    const points = 5;

    adminQuizQuestionUpdate('question1update', duration, points, [{ answer: 'a1update', correct: true }, { answer: 'a2update', correct: false }, { answer: 'a3update', correct: false }], token, quizId, questionId);
    adminQuizQuestionUpdate('question2update', duration, points, [{ answer: 'a1update', correct: true }, { answer: 'a2update', correct: false }], token, quizId, questionId2);
    adminQuizQuestionUpdate('question3update', duration, points, [{ answer: 'a1update', correct: true }, { answer: 'a2update', correct: false }], token, quizId, questionId3);
    adminQuizQuestionUpdate('question4update', duration, points, [{ answer: 'a1update', correct: true }, { answer: 'a2update', correct: false }], token, quizId, questionId4);

    expect(adminQuizInfo(token, quizId)).toStrictEqual({
      jsonBody: {
        quizId: quizId,
        name: 'Australian Cities',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'lorem ipsum',
        duration: duration * 4,
        numQuestions: 4,
        questions: [
          {
            questionId: questionId,
            question: 'question1update',
            duration: duration,
            points: points,
            answers: [
              {
                answerId: expect.any(Number),
                answer: 'a1update',
                correct: true,
              },
              {
                answerId: expect.any(Number),
                answer: 'a2update',
                correct: false,
              },
              {
                answerId: expect.any(Number),
                answer: 'a3update',
                correct: false,
              }
            ],
          },
          {
            questionId: questionId2,
            question: 'question2update',
            duration: duration,
            points: points,
            answers: [
              {
                answerId: expect.any(Number),
                answer: 'a1update',
                correct: true,
              },
              {
                answerId: expect.any(Number),
                answer: 'a2update',
                correct: false,
              }
            ],
          },
          {
            questionId: questionId3,
            question: 'question3update',
            duration: duration,
            points: points,
            answers: [
              {
                answerId: expect.any(Number),
                answer: 'a1update',
                correct: true,
              },
              {
                answerId: expect.any(Number),
                answer: 'a2update',
                correct: false,
              }
            ],
          },
          {
            questionId: questionId4,
            question: 'question4update',
            duration: duration,
            points: points,
            answers: [
              {
                answerId: expect.any(Number),
                answer: 'a1update',
                correct: true,
              },
              {
                answerId: expect.any(Number),
                answer: 'a2update',
                correct: false,
              }
            ],
          },
        ]
      },
      statusCode: 200,
    });
  });

  test.each([
    ['Q?', 4, 5, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }]],
    ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 4, 5, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }]],
  ])('Test Unsuccessful: Question length is not between 5 and 50 characters', (question, duration, points, answers) => {
    expect(adminQuizQuestionUpdate(question, duration, points, answers, token, quizId, questionId)).toStrictEqual({
      jsonBody: { error: expect.any(String) },
      statusCode: 400,
    });
  });

  test.each([
    ['What is the best city in Australia', 4, 5, [
      { answer: 'Sydney', correct: true },
      { answer: 'Melbourne', correct: false },
      { answer: 'Parramatta', correct: false },
      { answer: 'Brisbane', correct: false },
      { answer: 'Perth', correct: false },
      { answer: 'Geelong', correct: false },
      { answer: 'Gold Coast', correct: false },
    ]],
    ['What is the best city in Australia', 4, 5, [{ answer: 'Sydney', correct: true }]],
  ])('Test Unsuccessful: Number of Answers Not Between 2 and 6', (question, duration, points, answers) => {
    expect(adminQuizQuestionUpdate(question, duration, points, answers, token, quizId, questionId)).toStrictEqual({
      jsonBody: {
        error: expect.any(String),
      },
      statusCode: 400,
    });
  });

  test('Test Unsuccessful: Question Duration Negative', () => {
    const question = 'What is the best city in Australia';
    const points = 1;
    const duration = -1;
    const answers = [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }];
    expect(adminQuizQuestionUpdate(question, duration, points, answers, token, quizId, questionId)).toStrictEqual({
      jsonBody: {
        error: expect.any(String),
      },
      statusCode: 400,
    });
  });

  test.each([
    ['What is the best city in Australia', 4, -1, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }]],
    ['What is the best city in Australia', 4, 11, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }]],
  ])('Test Unsuccessful: Points are not between 1 and 10', (question, duration, points, answers) => {
    expect(adminQuizQuestionUpdate(question, duration, points, answers, token, quizId, questionId)).toStrictEqual({
      jsonBody: {
        error: expect.any(String),
      },
      statusCode: 400,
    });
  });

  test.each([
    ['What is the best city in Australia', 4, 1, [{ answer: '', correct: true }, { answer: 'Melbourne', correct: false }]],
    ['What is the best city in Australia', 4, 1, [{ answer: 'Sydney', correct: true }, { answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', correct: false }]],
  ])('Test Unsuccessful: Length of answer is not between 1 and 30', (question, duration, points, answers) => {
    expect(adminQuizQuestionUpdate(question, duration, points, answers, token, quizId, questionId)).toStrictEqual({
      jsonBody: {
        error: expect.any(String),
      },
      statusCode: 400,
    });
  });

  test('Test Unsuccessful: Answer Options Are the Same', () => {
    const question = 'What is the best city in Australia';
    const duration = 5;
    const points = 1;
    const answers = [{ answer: 'Sydney', correct: true }, { answer: 'Sydney', correct: false }];
    expect(adminQuizQuestionUpdate(question, duration, points, answers, token, quizId, questionId)).toStrictEqual({
      jsonBody: {
        error: expect.any(String),
      },
      statusCode: 400,
    });
  });

  test('Test Unsuccessful: No Correct Options', () => {
    const question = 'What is the best city in Australia';
    const duration = 5;
    const points = 1;
    const answers = [{ answer: 'Sydney', correct: false }, { answer: 'Sydney', correct: true }];
    expect(adminQuizQuestionUpdate(question, duration, points, answers, token, quizId, questionId)).toStrictEqual({
      jsonBody: {
        error: expect.any(String),
      },
      statusCode: 400,
    });
  });

  test('Test Unsuccessful: Quiz Duration Exceed 3 Minutes.', () => {
    let answers = [{ answer: 'Sydney', correct: false }, { answer: 'Melbourne', correct: true }];

    expect(adminQuizQuestionUpdate('Question1', 100, 1, answers, token, quizId, questionId)).toStrictEqual({
      jsonBody: {},
      statusCode: 200,
    });

    answers = [{ answer: 'Cricket', correct: false }, { answer: 'Football', correct: true }];
    expect(adminQuizQuestionUpdate('Question1', 81, 2, answers, token, quizId, questionId)).toStrictEqual({
      jsonBody: {
        error: expect.any(String),
      },
      statusCode: 400,
    });
  });

  test('Test Unsuccessful: User Does Not Own This Quiz', () => {
    const sessionId2 = adminAuthRegister('glhf@gmail.com', 'glhf1234', 'abcd', 'efgh').jsonBody;

    const question = 'What is the best city in Australia';
    const duration = 5;
    const points = 1;
    const answers = [{ answer: 'Sydney', correct: false }, { answer: 'Sydney', correct: true }];

    expect(adminQuizQuestionUpdate(question, duration, points, answers, sessionId2.token, quizId, questionId)).toStrictEqual({
      jsonBody: {
        error: expect.any(String),
      },
      statusCode: 403,
    });
  });

  test('Test Unsuccessful: No Correct Options', () => {
    const question = 'What is the best city in Australia';
    const duration = 5;
    const points = 1;
    const answers = [{ answer: 'Sydney', correct: false }, { answer: 'Sydney', correct: true }];
    expect(adminQuizQuestionUpdate(question, duration, points, answers, token, quizId, questionId)).toStrictEqual({
      jsonBody: {
        error: expect.any(String),
      },
      statusCode: 400,
    });
  });

  test.each([
    ['', 'What is the best city in Australia', 4, 1, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }]],
    ['000000', 'What is the best city in Australia', 4, 1, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }]],
  ])('Test Unsuccessful: Invalid Tokens', (tokenTemp, question, duration, points, answers) => {
    expect(adminQuizQuestionUpdate(question, duration, points, answers, tokenTemp, quizId, questionId)).toStrictEqual({
      jsonBody: {
        error: expect.any(String),
      },
      statusCode: 401,
    });
  });
});
