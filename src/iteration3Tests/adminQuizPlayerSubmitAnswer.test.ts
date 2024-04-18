import {
  adminQuizPlayerSubmitAnswer,
  v2adminQuizCreate,
  v2adminQuizQuestionCreate,
  adminQuizSessionCreate,
  adminQuizPlayerJoin,
  adminQuizSessionUpdate,
  v2adminQuizInfo,
  adminQuizGetSessionStatus
} from './v2testHelpers';
import {
  clear,
  adminAuthRegister,
} from '../iteration2Tests/testHelpers';
import { Answer } from '../interfaces';
import HTTPError from 'http-errors';

const thumbnailUrl = 'https://www.unsw.edu.au/content/dam/images/photos/events/open-day/2020-12-homepage-update/OpenDay_2019_campaign%20-0307-crop.cropimg.width=1920.crop=square.jpg';
let playerId: number;
let atQuestion: number;
let answerId: Answer[];
let token: string;
let quizId: number;
let sessionId: number;
beforeEach(() => {
  clear();

  token = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian').token;
  quizId = v2adminQuizCreate(token, 'QuizName', 'QuizDescription').quizId;

  v2adminQuizQuestionCreate(quizId, token, 'question1', 5, 4, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], thumbnailUrl);
  v2adminQuizQuestionCreate(quizId, token, 'question1', 5, 4,
    [{ answer: 'Adelaide', correct: true }, { answer: 'Perth', correct: false }, { answer: 'Canberra', correct: true }],
    thumbnailUrl);

  sessionId = adminQuizSessionCreate(token, quizId, 0).sessionId;
  playerId = adminQuizPlayerJoin(sessionId, 'Sami').playerId;
  answerId = v2adminQuizInfo(token, quizId).questions[0].answers;

  adminQuizSessionUpdate(token, quizId, sessionId, 'NEXT_QUESTION');
  adminQuizSessionUpdate(token, quizId, sessionId, 'SKIP_COUNTDOWN');
});

describe('adminQuizPlayerSubmitAnswer', () => {
  test('Correctly submits one answer', () => {
    atQuestion = adminQuizGetSessionStatus(quizId, sessionId, token).atQuestion;

    expect(adminQuizPlayerSubmitAnswer(playerId, atQuestion, [answerId[0].answerId])).toStrictEqual({});
  });

  test('Correctly submits multiple answers', () => {
    adminQuizSessionUpdate(token, quizId, sessionId, 'GO_TO_ANSWER');
    adminQuizSessionUpdate(token, quizId, sessionId, 'NEXT_QUESTION');
    adminQuizSessionUpdate(token, quizId, sessionId, 'SKIP_COUNTDOWN');

    atQuestion = adminQuizGetSessionStatus(quizId, sessionId, token).atQuestion;
    const answerId2 = v2adminQuizInfo(token, quizId).questions[atQuestion - 1].answers;

    expect(adminQuizPlayerSubmitAnswer(playerId, atQuestion, [answerId2[0].answerId, answerId2[2].answerId])).toStrictEqual({});
  });

  test('Invalid player ID', () => {
    expect(() => adminQuizPlayerSubmitAnswer(playerId + 1, atQuestion, [answerId[0].answerId])).toThrow(HTTPError[400]);
  });

  test('Session not in QUESTION_OPEN state', () => {
    adminQuizSessionUpdate(token, quizId, sessionId, 'END');

    expect(() => adminQuizPlayerSubmitAnswer(playerId, atQuestion, [answerId[0].answerId])).toThrow(HTTPError[400]);
  });

  test('Question position is not valid', () => {
    expect(() => adminQuizPlayerSubmitAnswer(playerId, atQuestion + 4, [answerId[0].answerId])).toThrow(HTTPError[400]);
  });

  test('Session is not yet up to this question', () => {
    const answerId2 = v2adminQuizInfo(token, quizId).questions[atQuestion - 1].answers;

    expect(() => adminQuizPlayerSubmitAnswer(playerId, atQuestion + 1, [answerId2[0].answerId, answerId2[2].answerId])).toThrow(HTTPError[400]);
  });

  test('No answers submitted', () => {
    expect(() => adminQuizPlayerSubmitAnswer(playerId, atQuestion, [])).toThrow(HTTPError[400]);
  });
});
