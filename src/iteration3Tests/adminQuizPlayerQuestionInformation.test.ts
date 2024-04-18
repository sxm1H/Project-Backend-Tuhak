import {
  v2adminQuizCreate,
  adminQuizSessionCreate,
  v2adminQuizQuestionCreate,
  adminQuizPlayerJoin,
  adminQuizPlayerQuestionInformation,
  adminQuizSessionUpdate
} from './v2testHelpers';
import {
  clear,
  adminAuthRegister
} from '../iteration2Tests/testHelpers';
import HTTPError from 'http-errors';

describe('adminQuizPlayerQuestionInformation', () => {
  let token: string;
  let thumbnailUrl: string;
  let quizId: number;
  let playerId: number;
  let sessionId: number;
  let questionId: number;

  beforeEach(() => {
    clear();
    thumbnailUrl = 'https://www.unsw.edu.au/content/dam/images/photos/events/open-day/2020-12-homepage-update/OpenDay_2019_campaign%20-0307-crop.cropimg.width=1920.crop=square.jpg';
    const user = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    token = user.token;
    const quiz = v2adminQuizCreate(token, 'QuizName', 'QuizDescription');
    quizId = quiz.quizId;
    questionId = v2adminQuizQuestionCreate(quizId, token, 'question1', 5, 4, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], thumbnailUrl).questionId;
    v2adminQuizQuestionCreate(quizId, token, 'question5', 5, 4, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], thumbnailUrl);
    sessionId = adminQuizSessionCreate(token, quizId, 5).sessionId;
    playerId = adminQuizPlayerJoin(sessionId, 'nick').playerId;
  });

  test('Successful case - no sessions yet', () => {
    adminQuizSessionUpdate(token, quizId, sessionId, 'NEXT_QUESTION');
    adminQuizSessionUpdate(token, quizId, sessionId, 'SKIP_COUNTDOWN');
    expect(adminQuizPlayerQuestionInformation(playerId, 1)).toStrictEqual(
      {
        questionId: questionId,
        question: 'question1',
        duration: 5,
        thumbnailUrl: thumbnailUrl,
        points: 4,
        answers: [
          { answer: 'Sydney', correct: true, answerId: expect.any(Number), colour: expect.any(String) },
          { answer: 'Melbourne', correct: false, answerId: expect.any(Number), colour: expect.any(String) }
        ],
      }
    );
  });

  test('Player ID Does not exist', () => {
    expect(() => adminQuizPlayerQuestionInformation(1234 + playerId, 1)).toThrow(HTTPError[400]);
  });

  test('question position is invalid (more than questions in quiz)', () => {
    expect(() => adminQuizPlayerQuestionInformation(playerId, 3)).toThrow(HTTPError[400]);
  });

  test('question position is invalid (negative number)', () => {
    expect(() => adminQuizPlayerQuestionInformation(playerId, -3)).toThrow(HTTPError[400]);
  });

  test('If session is not currently on this question', () => {
    expect(() => adminQuizPlayerQuestionInformation(playerId, 2)).toThrow(HTTPError[400]);
  });
});
