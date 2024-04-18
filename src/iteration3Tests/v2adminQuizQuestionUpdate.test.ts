import {
  clear,
  adminAuthRegister,
} from '../iteration2Tests/testHelpers';
import {
  v2adminQuizInfo,
  v2adminQuizCreate,
  v2adminQuizQuestionCreate,
  v2adminQuizQuestionUpdate
} from './v2testHelpers';
import HTTPError from 'http-errors';

const thumbnailUrl = 'https://www.unsw.edu.au/content/dam/images/photos/events/open-day/2020-12-homepage-update/OpenDay_2019_campaign%20-0307-crop.cropimg.width=1920.crop=square.jpg';
let token: string;
let quizId: number;
let questionId: number;
beforeEach(() => {
  clear();

  token = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh').token;
  quizId = v2adminQuizCreate(token, 'Australian Cities', 'lorem ipsum').quizId;
  questionId = v2adminQuizQuestionCreate(quizId, token, 'What is the best city in Australia', 4, 5,
    [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], thumbnailUrl).questionId;
});

describe('Testing POST /v1/admin/quiz/:quizid/question', () => {
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
    expect(v2adminQuizQuestionUpdate(question, duration, points, answers, token, quizId, questionId, thumbnailUrl)).toStrictEqual({});
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

    expect(v2adminQuizQuestionUpdate(question, duration, points, answers, token, quizId, questionId, thumbnailUrl)).toStrictEqual({ });

    expect(v2adminQuizInfo(token, quizId)).toStrictEqual({
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
              colour: expect.any(String)
            },
            {
              answerId: expect.any(Number),
              answer: 'Video Games',
              correct: false,
              colour: expect.any(String)
            }
          ],
          thumbnailUrl: thumbnailUrl
        }
      ],
      thumbnailUrl: thumbnailUrl
    });
  });

  test('Comprehensive Test Successful: Creating Multiple Questions, Updating them Simultaneously, then checking QuizInfo', () => {
    const questionId2 = v2adminQuizQuestionCreate(quizId, token, 'Question2', 4, 5, [{ answer: 'Hello', correct: true }, { answer: 'Bye', correct: false }], thumbnailUrl).questionId;
    const questionId3 = v2adminQuizQuestionCreate(quizId, token, 'Question3', 4, 5, [{ answer: 'lorem', correct: true }, { answer: 'ispum', correct: false }], thumbnailUrl).questionId;
    const questionId4 = v2adminQuizQuestionCreate(quizId, token, 'Question3', 4, 5, [{ answer: 'answer1', correct: true }, { answer: 'answer2', correct: false }], thumbnailUrl).questionId;

    const duration = 4;
    const points = 5;

    v2adminQuizQuestionUpdate('question1update', duration, points, [{ answer: 'a1update', correct: true }, { answer: 'a2update', correct: false }, { answer: 'a3update', correct: false }], token, quizId, questionId, thumbnailUrl);
    v2adminQuizQuestionUpdate('question2update', duration, points, [{ answer: 'a1update', correct: true }, { answer: 'a2update', correct: false }], token, quizId, questionId2, thumbnailUrl);
    v2adminQuizQuestionUpdate('question3update', duration, points, [{ answer: 'a1update', correct: true }, { answer: 'a2update', correct: false }], token, quizId, questionId3, thumbnailUrl);
    v2adminQuizQuestionUpdate('question4update', duration, points, [{ answer: 'a1update', correct: true }, { answer: 'a2update', correct: false }], token, quizId, questionId4, thumbnailUrl);

    expect(v2adminQuizInfo(token, quizId)).toStrictEqual({
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
              colour: expect.any(String)
            },
            {
              answerId: expect.any(Number),
              answer: 'a2update',
              correct: false,
              colour: expect.any(String)
            },
            {
              answerId: expect.any(Number),
              answer: 'a3update',
              correct: false,
              colour: expect.any(String)
            }
          ],
          thumbnailUrl: thumbnailUrl,
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
              colour: expect.any(String)
            },
            {
              answerId: expect.any(Number),
              answer: 'a2update',
              correct: false,
              colour: expect.any(String)
            }
          ],
          thumbnailUrl: thumbnailUrl,
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
              colour: expect.any(String)
            },
            {
              answerId: expect.any(Number),
              answer: 'a2update',
              correct: false,
              colour: expect.any(String)
            }
          ],
          thumbnailUrl: thumbnailUrl,
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
              colour: expect.any(String)
            },
            {
              answerId: expect.any(Number),
              answer: 'a2update',
              correct: false,
              colour: expect.any(String)
            }
          ],
          thumbnailUrl: thumbnailUrl,
        },
      ],
      thumbnailUrl: thumbnailUrl,
    });
  });

  test.each([
    ['Q?', 4, 5, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }]],
    ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 4, 5, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }]],
  ])('Test Unsuccessful: Question length is not between 5 and 50 characters', (question, duration, points, answers) => {
    expect(() => v2adminQuizQuestionUpdate(question, duration, points, answers, token, quizId, questionId, thumbnailUrl)).toThrow(HTTPError[400]);
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
    expect(() => v2adminQuizQuestionUpdate(question, duration, points, answers, token, quizId, questionId, thumbnailUrl)).toThrow(HTTPError[400]);
  });

  test('Test Unsuccessful: Question Duration Negative', () => {
    const question = 'What is the best city in Australia';
    const points = 1;
    const duration = -1;
    const answers = [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }];
    expect(() => v2adminQuizQuestionUpdate(question, duration, points, answers, token, quizId, questionId, thumbnailUrl)).toThrow(HTTPError[400]);
  });

  test.each([
    ['What is the best city in Australia', 4, -1, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }]],
    ['What is the best city in Australia', 4, 11, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }]],
  ])('Test Unsuccessful: Points are not between 1 and 10', (question, duration, points, answers) => {
    expect(() => v2adminQuizQuestionUpdate(question, duration, points, answers, token, quizId, questionId, thumbnailUrl)).toThrow(HTTPError[400]);
  });

  test.each([
    ['What is the best city in Australia', 4, 1, [{ answer: '', correct: true }, { answer: 'Melbourne', correct: false }]],
    ['What is the best city in Australia', 4, 1, [{ answer: 'Sydney', correct: true }, { answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', correct: false }]],
  ])('Test Unsuccessful: Length of answer is not between 1 and 30', (question, duration, points, answers) => {
    expect(() => v2adminQuizQuestionUpdate(question, duration, points, answers, token, quizId, questionId, thumbnailUrl)).toThrow(HTTPError[400]);
  });

  test('Test Unsuccessful: Answer Options Are the Same', () => {
    const question = 'What is the best city in Australia';
    const duration = 5;
    const points = 1;
    const answers = [{ answer: 'Sydney', correct: true }, { answer: 'Sydney', correct: false }];
    expect(() => v2adminQuizQuestionUpdate(question, duration, points, answers, token, quizId, questionId, thumbnailUrl)).toThrow(HTTPError[400]);
  });

  test('Test Unsuccessful: Quiz Duration Exceed 3 Minutes.', () => {
    let answers = [{ answer: 'Sydney', correct: false }, { answer: 'Melbourne', correct: true }];

    expect(v2adminQuizQuestionUpdate('Question1', 100, 1, answers, token, quizId, questionId, thumbnailUrl)).toStrictEqual({});

    answers = [{ answer: 'Cricket', correct: false }, { answer: 'Football', correct: true }];
    expect(() => v2adminQuizQuestionUpdate('Question1', 81, 2, answers, token, quizId, questionId, thumbnailUrl)).toThrow(HTTPError[400]);
  });

  test('Test Unsuccessful: User Does Not Own This Quiz', () => {
    const sessionId2 = adminAuthRegister('glhf@gmail.com', 'glhf1234', 'abcd', 'efgh');

    const question = 'What is the best city in Australia';
    const duration = 5;
    const points = 1;
    const answers = [{ answer: 'Sydney', correct: false }, { answer: 'Sydney', correct: true }];

    expect(() => v2adminQuizQuestionUpdate(question, duration, points, answers, sessionId2.token, quizId, questionId, thumbnailUrl)).toThrow(HTTPError[403]);
  });

  test('Test Unsuccessful: No Correct Options', () => {
    const question = 'What is the best city in Australia';
    const duration = 5;
    const points = 1;
    const answers = [{ answer: 'Sydney', correct: false }, { answer: 'Melb', correct: false }];
    expect(() => v2adminQuizQuestionUpdate(question, duration, points, answers, token, quizId, questionId, thumbnailUrl)).toThrow(HTTPError[400]);
  });

  test.each([
    ['', 'What is the best city in Australia', 4, 1, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }]],
    ['000000', 'What is the best city in Australia', 4, 1, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }]],
  ])('Test Unsuccessful: Invalid Tokens', (tokenTemp, question, duration, points, answers) => {
    expect(() => v2adminQuizQuestionUpdate(question, duration, points, answers, tokenTemp, quizId, questionId, thumbnailUrl)).toThrow(HTTPError[401]);
  });

  test('Test Unsuccessful: Invalid Quiz Id', () => {
    const question = 'Question1';
    const points = 4;
    const duration = 3;
    const answers = [{ answer: 'Sydney', correct: true }, { answer: 'NSW', correct: false }];
    expect(() => v2adminQuizQuestionUpdate(question, duration, points, answers, token, -1, questionId, thumbnailUrl)).toThrow(HTTPError[403]);
  });

  test('Test Unsuccessful: Invalid QuestionId', () => {
    const question = 'Question1';
    const points = 4;
    const duration = 3;
    const answers = [{ answer: 'Sydney', correct: true }, { answer: 'NSW', correct: false }];
    expect(() => v2adminQuizQuestionUpdate(question, duration, points, answers, token, quizId, -1, thumbnailUrl)).toThrow(HTTPError[400]);
  });
});
