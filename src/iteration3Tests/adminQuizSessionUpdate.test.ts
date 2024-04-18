import {
  v2adminQuizCreate,
  adminQuizSessionCreate,
  adminQuizSessionUpdate,
  v2adminQuizQuestionCreate,
} from './v2testHelpers';
import {
  clear,
  adminAuthRegister
} from '../iteration2Tests/testHelpers';
import {
  Actions,
} from '../interfaces';

import HTTPError from 'http-errors';

let token: string;
let quizId: number;
const validUrl = 'https://s3-eu-west-1.amazonaws.com/blog-ecotree/blog/0001/01/ad46dbb447cd0e9a6aeecd64cc2bd332b0cbcb79.jpeg';
let sessionId: number;

function sleepSync(ms: number) {
  const startTime = new Date().getTime();
  while (new Date().getTime() - startTime < ms) {
    // zzzZZ - comment needed so eslint doesn't complain
  }
}

beforeEach(() => {
  clear();

  token = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian').token;
  quizId = v2adminQuizCreate(token, 'QuizName', 'QuizDescription').quizId;
  v2adminQuizQuestionCreate(quizId, token, 'question1', 1, 4, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], validUrl);
  sessionId = adminQuizSessionCreate(token, quizId, 5).sessionId;
});

describe('Testing PUT /v1/admin/quiz/{quizid}/session/{sessionid}', () => {
  /// ////////////////////Action routes from states/////////////////////////////////////////
  test('test case LOBBY', () => {
    expect(() => adminQuizSessionUpdate(token, quizId, sessionId, Actions.GO_TO_FINAL_RESULTS)).toThrow(HTTPError[400]);
    expect(adminQuizSessionUpdate(token, quizId, sessionId, 'END')).toStrictEqual({});
    expect(() => adminQuizSessionUpdate(token, quizId, sessionId, Actions.SKIP_COUNTDOWN)).toThrow(HTTPError[400]);
  });

  test('Successful test case two sessions QUESTION_COUNTDOWN', () => {
    const newToken = adminAuthRegister('pog@gmail.com', 'pogggg1234', 'pog', 'pog').token;
    const newquizId = v2adminQuizCreate(newToken, 'jkldfjaf', 'djfaldkjfkd').quizId;
    v2adminQuizQuestionCreate(newquizId, newToken, 'question1', 3, 4, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], validUrl);
    const newSessionId = adminQuizSessionCreate(newToken, newquizId, 5).sessionId;

    expect(adminQuizSessionUpdate(token, quizId, sessionId, Actions.NEXT_QUESTION)).toStrictEqual({});
    expect(adminQuizSessionUpdate(newToken, newquizId, newSessionId, Actions.NEXT_QUESTION)).toStrictEqual({});

    sleepSync(4 * 1000);
  });

  test('Testing QUESTION_COUNTDOWN Skipped', () => {
    adminQuizSessionUpdate(token, quizId, sessionId, Actions.NEXT_QUESTION);
    expect(() => adminQuizSessionUpdate(token, quizId, sessionId, Actions.GO_TO_FINAL_RESULTS)).toThrow(HTTPError[400]);
    expect(adminQuizSessionUpdate(token, quizId, sessionId, Actions.END)).toStrictEqual({});
  });

  test('Testing QUESTION_OPEN goes to END', () => {
    adminQuizSessionUpdate(token, quizId, sessionId, Actions.NEXT_QUESTION);
    adminQuizSessionUpdate(token, quizId, sessionId, Actions.SKIP_COUNTDOWN);
    expect(() => adminQuizSessionUpdate(token, quizId, sessionId, Actions.GO_TO_FINAL_RESULTS)).toThrow(HTTPError[400]);
    expect(adminQuizSessionUpdate(token, quizId, sessionId, Actions.END)).toStrictEqual({});
  });

  test('Testing QUESTION_CLOSE goes to END', () => {
    adminQuizSessionUpdate(token, quizId, sessionId, Actions.NEXT_QUESTION);
    adminQuizSessionUpdate(token, quizId, sessionId, Actions.SKIP_COUNTDOWN);
    sleepSync(1.25 * 1000);
    expect(() => adminQuizSessionUpdate(token, quizId, sessionId, Actions.SKIP_COUNTDOWN)).toThrow(HTTPError[400]);
    expect(adminQuizSessionUpdate(token, quizId, sessionId, Actions.END)).toStrictEqual({});
  });

  test('Testing FINAL_RESULTS goes to END', () => {
    adminQuizSessionUpdate(token, quizId, sessionId, Actions.NEXT_QUESTION);
    adminQuizSessionUpdate(token, quizId, sessionId, Actions.SKIP_COUNTDOWN);
    sleepSync(1.25 * 1000);
    adminQuizSessionUpdate(token, quizId, sessionId, Actions.GO_TO_FINAL_RESULTS);
    expect(() => adminQuizSessionUpdate(token, quizId, sessionId, Actions.SKIP_COUNTDOWN)).toThrow(HTTPError[400]);
    expect(adminQuizSessionUpdate(token, quizId, sessionId, Actions.END)).toStrictEqual({});
  });

  test('Testing QUESTION_OPEN goes to ANSWER_SHOW goes to END', () => {
    adminQuizSessionUpdate(token, quizId, sessionId, Actions.NEXT_QUESTION);
    adminQuizSessionUpdate(token, quizId, sessionId, Actions.SKIP_COUNTDOWN);
    expect(adminQuizSessionUpdate(token, quizId, sessionId, Actions.GO_TO_ANSWER)).toStrictEqual({});
    expect(() => adminQuizSessionUpdate(token, quizId, sessionId, Actions.SKIP_COUNTDOWN)).toThrow(HTTPError[400]);
    expect(adminQuizSessionUpdate(token, quizId, sessionId, Actions.END)).toStrictEqual({});
  });

  test('Testing QUESTION_CLOSE goes to ANSWER_SHOW', () => {
    adminQuizSessionUpdate(token, quizId, sessionId, Actions.NEXT_QUESTION);
    adminQuizSessionUpdate(token, quizId, sessionId, Actions.SKIP_COUNTDOWN);
    sleepSync(1.25 * 1000);
    expect(adminQuizSessionUpdate(token, quizId, sessionId, Actions.GO_TO_ANSWER)).toStrictEqual({});
  });

  test('Testing ANSWER_SHOW goes to QUESTION_COUNTDOWN', () => {
    v2adminQuizQuestionCreate(quizId, token, 'question2', 5, 4, [{ answer: 'yep', correct: true }, { answer: 'nope', correct: false }], validUrl);
    adminQuizSessionUpdate(token, quizId, sessionId, Actions.NEXT_QUESTION);
    adminQuizSessionUpdate(token, quizId, sessionId, Actions.SKIP_COUNTDOWN);
    sleepSync(1.25 * 1000);
    adminQuizSessionUpdate(token, quizId, sessionId, Actions.GO_TO_ANSWER);
    expect(adminQuizSessionUpdate(token, quizId, sessionId, Actions.NEXT_QUESTION)).toStrictEqual({});
    expect(adminQuizSessionUpdate(token, quizId, sessionId, Actions.END)).toStrictEqual({});
  });

  /// ////////////////////////////////////////////////////////////////////////////
  test('Session Id does notrefer to valid session', () => {
    expect(() => adminQuizSessionUpdate(token, quizId, sessionId + 1, 'END')).toThrow(HTTPError[400]);
  });

  test('Action provided is not valid action', () => {
    expect(() => adminQuizSessionUpdate(token, quizId, sessionId, 'THISSUCKS')).toThrow(HTTPError[400]);
  });

  test('Token is empty or invalid', () => {
    expect(() => adminQuizSessionUpdate(token + '1', quizId, sessionId, Actions.END)).toThrow(HTTPError[401]);
  });

  test('QuizId is not valid', () => {
    expect(() => adminQuizSessionUpdate(token, quizId + 1, sessionId, Actions.GO_TO_FINAL_RESULTS)).toThrow(HTTPError[403]);
  });

  test('User does not own quiz', () => {
    const newToken = adminAuthRegister('pog@gmail.com', 'pogggg1234', 'pog', 'pog').token;
    expect(() => adminQuizSessionUpdate(newToken, quizId, sessionId, Actions.GO_TO_FINAL_RESULTS)).toThrow(HTTPError[403]);
  });
});
