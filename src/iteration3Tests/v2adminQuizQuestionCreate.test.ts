import {
  clear,
  adminAuthRegister,
} from '../iteration2Tests/testHelpers';
import {
  v2adminQuizQuestionCreate,
  v2adminQuizInfo,
  v2adminQuizCreate,
} from './v2testHelpers';
import HTTPError from 'http-errors';

const thumbnailUrl = 'https://www.unsw.edu.au/content/dam/images/photos/events/open-day/2020-12-homepage-update/OpenDay_2019_campaign%20-0307-crop.cropimg.width=1920.crop=square.jpg';
let token: string;
let quizId: number;
beforeEach(() => {
  clear();

  token = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh').token;
  quizId = v2adminQuizCreate(token, 'Australian Cities', 'lorem ipsum').quizId;
});

describe('Testing POST /v1/admin/quiz/:quizid/question', () => {
  test('Comprehensive Test Successful: Creating a Question and Checking adminQuizInfo', () => {
    const response = v2adminQuizQuestionCreate(quizId, token, 'question1', 5, 4, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], thumbnailUrl);
    expect(response).toStrictEqual({
      questionId: expect.any(Number),
    });
    const response2 = v2adminQuizInfo(token, quizId);
    expect(response2.questions).toStrictEqual([
      {
        questionId: response.questionId,
        question: 'question1',
        duration: 5,
        points: 4,
        answers: [
          {
            answerId: expect.any(Number),
            answer: 'Sydney',
            colour: expect.any(String),
            correct: true,
          },
          {
            answerId: expect.any(Number),
            answer: 'Melbourne',
            colour: expect.any(String),
            correct: false,
          }
        ],
        thumbnailUrl: thumbnailUrl,
      }
    ]);
    expect(response2.duration).toStrictEqual(5);
    expect(response2.numQuestions).toStrictEqual(1);
  });

  test.each([
    ['What is the best city in Australia', 4, 5, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }]],
    ['What is the best city in Australia', 4, 5, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }]],
  ])('Test Successful: Creating a Question with One or More Answers', (question, duration, points, answers) => {
    expect(v2adminQuizQuestionCreate(quizId, token, question, duration, points, answers, thumbnailUrl)).toStrictEqual({

      questionId: expect.any(Number),

    });
  });
  test.each([
    ['Q?', 4, 5, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }]],
    ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 4, 5, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }]],
  ])('Test Unsuccessful: Question length is not between 5 and 50 characters', (question, duration, points, answers) => {
    expect(() => v2adminQuizQuestionCreate(quizId, token, question, duration, points, answers, thumbnailUrl)).toThrow(HTTPError[400]);
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
    expect(() => v2adminQuizQuestionCreate(quizId, token, question, duration, points, answers, thumbnailUrl)).toThrow(HTTPError[400]);
  });

  test('Test Unsuccessful: Question Duration Negative', () => {
    const question = 'What is the best city in Australia';
    const points = 1;
    const answers = [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }];
    expect(() => v2adminQuizQuestionCreate(quizId, token, question, -1, points, answers, thumbnailUrl)).toThrow(HTTPError[400]);
  });

  test.each([
    ['What is the best city in Australia', 4, -1, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }]],
    ['What is the best city in Australia', 4, 11, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }]],
  ])('Test Unsuccessful: Points are not between 1 and 10', (question, duration, points, answers) => {
    expect(() => v2adminQuizQuestionCreate(quizId, token, question, duration, points, answers, thumbnailUrl)).toThrow(HTTPError[400]);
  });

  test.each([
    ['What is the best city in Australia', 4, 1, [{ answer: '', correct: true }, { answer: 'Melbourne asuduihasddash sdauiasdhiasduhsadui sdasad', correct: false }]],
    ['What is the best city in Australia', 4, 1, [{ answer: 'Sydney', correct: true }, { answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', correct: false }]],
  ])('Test Unsuccessful: Length of answer is not between 1 and 30', (question, duration, points, answers) => {
    expect(() => v2adminQuizQuestionCreate(quizId, token, question, duration, points, answers, thumbnailUrl)).toThrow(HTTPError[400]);
  });

  test('Test Unsuccessful: Answer Options Are the Same', () => {
    const question = 'What is the best city in Australia';
    const duration = 5;
    const points = 1;
    const answers = [{ answer: 'Sydney', correct: true }, { answer: 'Sydney', correct: false }];
    expect(() => v2adminQuizQuestionCreate(quizId, token, question, duration, points, answers, thumbnailUrl)).toThrow(HTTPError[400]);
  });

  test('Test Unsuccessful: No Correct Options', () => {
    const question = 'What is the best city in Australia';
    const duration = 5;
    const points = 1;
    const answers = [{ answer: 'Sydney', correct: false }, { answer: 'Melbourne', correct: false }];
    expect(() => v2adminQuizQuestionCreate(quizId, token, question, duration, points, answers, thumbnailUrl)).toThrow(HTTPError[400]);
  });

  test('Test Unsuccessful: Quiz Duration Exceed 3 Minutes.', () => {
    let answers = [{ answer: 'Sydney', correct: false }, { answer: 'Melbourne', correct: true }];

    expect(v2adminQuizQuestionCreate(quizId, token, 'Question1', 100, 1, answers, thumbnailUrl)).toStrictEqual({
      questionId: expect.any(Number),
    });

    answers = [{ answer: 'Cricket', correct: false }, { answer: 'Football', correct: true }];
    expect(() => v2adminQuizQuestionCreate(quizId, token, 'Question2', 81, 2, answers, thumbnailUrl)).toThrow(HTTPError[400]);
  });

  test('Test Unsuccessful: User Does Not Own This Quiz', () => {
    const sessionId2 = adminAuthRegister('glhf@gmail.com', 'glhf1234', 'abcd', 'efgh');

    const question = 'What is the best city in Australia';
    const duration = 5;
    const points = 1;
    const answers = [{ answer: 'Sydney', correct: false }, { answer: 'Sydney', correct: true }];
    expect(() => v2adminQuizQuestionCreate(quizId, sessionId2.token, question, duration, points, answers, thumbnailUrl)).toThrow(HTTPError[403]);
  });

  test.each([
    ['', 'What is the best city in Australia', 4, 1, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }]],
    ['000000', 'What is the best city in Australia', 4, 1, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }]],
  ])('Test Unsuccessful: Invalid Tokens', (tokenTemp, question, duration, points, answers) => {
    expect(() => v2adminQuizQuestionCreate(quizId, tokenTemp, question, duration, points, answers, thumbnailUrl)).toThrow(HTTPError[401]);
  });

  test('Test Unsuccessful: Invalid Quiz Id', () => {
    const question = 'Question1';
    const points = 4;
    const duration = 3;
    const answers = [{ answer: 'Sydney', correct: true }, { answer: 'NSW', correct: false }];
    expect(() => v2adminQuizQuestionCreate(-1, token, question, duration, points, answers, thumbnailUrl)).toThrow(HTTPError[403]);
  });

  test.each([
    ['What is the best city in Australia', 4, 5, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], 'www.unsw.edu.au/content/dam/images/photos/events/open-day/2020-12-homepage-update/OpenDay_2019_campaign%20-0307-crop.cropimg.width=1920.crop=square.jpg'],
    ['What is the best city in Australia', 4, 5, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], ''],
    ['What is the best city in Australia', 4, 5, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], 'https://www.unsw.edu.au/content/dam/images/photos/events/open-day/2020-12-homepage-update/OpenDay_2019_campaign%20-0307-crop.cropimg.width=1920.crop=square'],
  ])('Test Successful: Creating a Question with One or More Answers', (question, duration, points, answers, thumbnailUrl) => {
    expect(() => v2adminQuizQuestionCreate(quizId, token, question, duration, points, answers, thumbnailUrl)).toThrow(HTTPError[400]);
  });
});
