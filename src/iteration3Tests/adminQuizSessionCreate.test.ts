import {
  v2adminQuizCreate,
  adminQuizSessions,
  adminQuizSessionCreate,
  adminQuizSessionUpdate,
  v2AdminQuizQuestionCreate,
  v2adminQuizRemove
} from './v2testHelpers';
import {
  clear,
  adminAuthRegister
} from '../iteration2Tests/testHelpers';
import {
  States,
  Actions,
} from '../interfaces';
import HTTPError from 'http-errors';

describe('adminQuizSessions', () => {
  let token: string;
  let thumbnailUrl: string;
  let quizId: number;
  let action: string;

  beforeEach(() => {
    clear();
    const user = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    token = user.token;
    const quiz = v2adminQuizCreate(token, 'QuizName', 'QuizDescription');
    quizId = quiz.quizId;
    thumbnailUrl = 'https://www.unsw.edu.au/content/dam/images/photos/events/open-day/2020-12-homepage-update/OpenDay_2019_campaign%20-0307-crop.cropimg.width=1920.crop=square.jpg';
  });

  test('Successful case - no sessions yet', () => {
    const sessions = adminQuizSessions(quizId, token);
    expect(sessions).toStrictEqual({
      activeSessions: [],
      inactiveSessions: []
    });
  });

  test('Token is invalid', () => {
    const invalidToken = 'invalid-token';
    expect(() => adminQuizSessions(quizId, invalidToken)).toThrow(HTTPError[401]);
  });

  test('Quiz ID is invalid', () => {
    const invalidQuizId = 99999; // assuming 99999 is not a valid quizId
    expect(() => adminQuizSessions(invalidQuizId, token)).toThrow(HTTPError[403]);
  });

  test('User does not own the quiz', () => {
    const otherUser = adminAuthRegister('otheruser@gmail.com', 'password123', 'Other', 'User');
    const otherToken = otherUser.token;
    expect(() => adminQuizSessions(quizId, otherToken)).toThrow(HTTPError[403]);
  });

  test('Handles active and inactive sessions correctly', () => {
    // Start sessions and update one to end
    const response = v2AdminQuizQuestionCreate(quizId, token, 'question1', 5, 4, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], thumbnailUrl);
    const sessionId1 = adminQuizSessionCreate(token, quizId, 3).sessionId;
    const sessionId2 = adminQuizSessionCreate(token, quizId, 6).sessionId;
    adminQuizSessionUpdate(token, quizId, sessionId2, States.END);
    const sessions = adminQuizSessions(quizId, token);
    expect(sessions.activeSessions).toContain(sessionId1);
    expect(sessions.inactiveSessions).toContain(sessionId2);
  });

  test('Quiz removed and accessed again', () => {
    v2adminQuizRemove(token, quizId);
    expect(() => adminQuizSessions(quizId, token)).toThrow(HTTPError[403]);
  });

  test('Quiz without questions throws error when trying to create a session', () => {
    // Assume the system requires at least one question to start a session
    expect(() => adminQuizSessionCreate(token, quizId, 3)).toThrow(HTTPError[400]);
  });

  test('Adding questions to the quiz and starting a session', () => {
    v2AdminQuizQuestionCreate( quizId,token, 'What is the capital of Australia?', 5, 1, [{ answer: 'Canberra', correct: true }, { answer: 'Sydney', correct: false }], thumbnailUrl);
    const sessionId = adminQuizSessionCreate(token, quizId, 3).sessionId;
    expect(sessionId).toBeDefined();
  });
});
