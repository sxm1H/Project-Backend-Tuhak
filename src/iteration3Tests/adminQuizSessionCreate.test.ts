import {
  v2adminQuizCreate,
  adminQuizSessions,
  adminQuizSessionCreate,
  adminQuizSessionUpdate,
  v2adminQuizQuestionCreate,
  v2adminQuizRemove
} from './v2testHelpers';
import {
  clear,
  adminAuthRegister
} from '../iteration2Tests/testHelpers';
import { States } from '../interfaces';
import HTTPError from 'http-errors';

let token: string;
let thumbnailUrl: string;
let quizId: number;
beforeEach(() => {
  clear();
  const user = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
  token = user.token;
  const quiz = v2adminQuizCreate(token, 'QuizName', 'QuizDescription');
  quizId = quiz.quizId;
  thumbnailUrl = 'https://www.unsw.edu.au/content/dam/images/photos/events/open-day/2020-12-homepage-update/OpenDay_2019_campaign%20-0307-crop.cropimg.width=1920.crop=square.jpg';
});

describe('adminQuizSessions', () => {
  test('Successful case - no sessions yet', () => {
    v2adminQuizQuestionCreate(quizId, token, 'question1', 5, 4, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], thumbnailUrl);
    const sessions = adminQuizSessionCreate(token, quizId, 3);
    expect(sessions).toStrictEqual({
      sessionId: expect.any(Number),
    });
  });

  test('Token is invalid', () => {
    v2adminQuizQuestionCreate(quizId, token, 'question1', 5, 4, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], thumbnailUrl);
    const invalidToken = 'invalid-token';
    expect(() => adminQuizSessionCreate(invalidToken, quizId, 3)).toThrow(HTTPError[401]);
  });

  test('Quiz ID is invalid', () => {
    v2adminQuizQuestionCreate(quizId, token, 'question1', 5, 4, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], thumbnailUrl);
    const invalidQuizId = 99999; // assuming 99999 is not a valid quizId
    expect(() => adminQuizSessionCreate(token, invalidQuizId, 3)).toThrow(HTTPError[403]);
  });

  test('User does not own the quiz', () => {
    const otherUser = adminAuthRegister('otheruser@gmail.com', 'password123', 'Other', 'User');
    const otherToken = otherUser.token;
    expect(() => adminQuizSessionCreate(otherToken, quizId, 3)).toThrow(HTTPError[403]);
  });

  test('Handles active and inactive sessions correctly', () => {
    // Start sessions and update one to end
    v2adminQuizQuestionCreate(quizId, token, 'question1', 5, 4, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], thumbnailUrl);
    v2adminQuizQuestionCreate(quizId, token, 'question1', 5, 4, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], thumbnailUrl);
    const sessionId1 = adminQuizSessionCreate(token, quizId, 3).sessionId;
    const sessionId2 = adminQuizSessionCreate(token, quizId, 6).sessionId;
    adminQuizSessionUpdate(token, quizId, sessionId2, States.END);
    const sessions = adminQuizSessions(quizId, token);
    expect(sessions.activeSessions).toContain(sessionId1);
    expect(sessions.inactiveSessions).toContain(sessionId2);
  });

  test('Quiz removed and accessed again', () => {
    v2adminQuizQuestionCreate(quizId, token, 'question1', 5, 4, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], thumbnailUrl);
    v2adminQuizRemove(token, quizId);
    expect(() => adminQuizSessionCreate(token, quizId, 3)).toThrow(HTTPError[403]);
  });

  test('Quiz without questions throws error when trying to create a session', () => {
    // Assume the system requires at least one question to start a session
    expect(() => adminQuizSessionCreate(token, quizId, 3)).toThrow(HTTPError[400]);
  });

  test('Adding questions to the quiz and starting a session', () => {
    v2adminQuizQuestionCreate(quizId, token, 'What is the capital of Australia?', 5, 1, [{ answer: 'Canberra', correct: true }, { answer: 'Sydney', correct: false }], thumbnailUrl);
    const sessionId = adminQuizSessionCreate(token, quizId, 3).sessionId;
    expect(sessionId).toBeDefined();
  });
});
