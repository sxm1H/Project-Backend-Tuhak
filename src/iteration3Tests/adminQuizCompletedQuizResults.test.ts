import {
  v2adminQuizCreate,
  v2adminQuizQuestionCreate,
  adminQuizSessionCreate,
  adminQuizSessionUpdate,
  adminQuizPlayerJoin,
  adminQuizPlayerSubmitAnswer,
  v2adminQuizInfo,
  adminQuizCompletedQuizResults
} from './v2testHelpers';
import {
  clear,
  adminAuthRegister
} from '../iteration2Tests/testHelpers';
import HTTPError from 'http-errors';

function sleepSync(ms: number) {
  const startTime = new Date().getTime();
  while (new Date().getTime() - startTime < ms) {
    // zzzZZ - comment needed so eslint doesn't complain
  }
}

let token1: string;
let quizId: number;
let questionId: number;
const thumbnailUrl = 'https://www.unsw.edu.au/content/dam/images/photos/events/open-day/2020-12-homepage-update/OpenDay_2019_campaign%20-0307-crop.cropimg.width=1920.crop=square.jpg';
beforeEach(() => {
  clear();

  token1 = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian').token;
  quizId = v2adminQuizCreate(token1, 'QuizName', 'QuizDescription').quizId;
  questionId = v2adminQuizQuestionCreate(quizId, token1, 'question1', 5, 4, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], thumbnailUrl).questionId;
});

describe('Testing /v1/admin/{quizid}/session/{sessionid}/results', () => {
  test('Test Successful: The Admin Getting the Final Results', () => {
    const sessionId = adminQuizSessionCreate(token1, quizId, 0).sessionId;
    const playerId1 = adminQuizPlayerJoin(sessionId, 'Sami').playerId;
    const playerId2 = adminQuizPlayerJoin(sessionId, 'Dun Yao').playerId;
    adminQuizSessionUpdate(token1, quizId, sessionId, 'NEXT_QUESTION');
    adminQuizSessionUpdate(token1, quizId, sessionId, 'SKIP_COUNTDOWN');
    const answerId1 = v2adminQuizInfo(token1, quizId).questions[0].answers;
    sleepSync(1000);
    adminQuizPlayerSubmitAnswer(playerId1, 1, [answerId1[0].answerId]);
    sleepSync(1000);
    adminQuizPlayerSubmitAnswer(playerId2, 1, [answerId1[1].answerId]);
    adminQuizSessionUpdate(token1, quizId, sessionId, 'GO_TO_ANSWER');
    adminQuizSessionUpdate(token1, quizId, sessionId, 'GO_TO_FINAL_RESULTS');

    expect(adminQuizCompletedQuizResults(quizId, sessionId, token1)).toStrictEqual({
      usersRankedByScore: [{ name: 'Sami', score: 4 }, { name: 'Dun Yao', score: 0 }],
      questionResults: [
        {
          questionId: questionId,
          playersCorrectList: ['Sami'],
          averageAnswerTime: 2,
          percentageCorrect: 50,
        }
      ]
    });
  });

  test('Test Unsuccessful: Session Id is invalid', () => {
    const sessionId = adminQuizSessionCreate(token1, quizId, 0).sessionId;
    const playerId1 = adminQuizPlayerJoin(sessionId, 'Sami').playerId;
    const playerId2 = adminQuizPlayerJoin(sessionId, 'Dun Yao').playerId;
    adminQuizSessionUpdate(token1, quizId, sessionId, 'NEXT_QUESTION');
    adminQuizSessionUpdate(token1, quizId, sessionId, 'SKIP_COUNTDOWN');
    const answerId1 = v2adminQuizInfo(token1, quizId).questions[0].answers;
    sleepSync(1000);
    adminQuizPlayerSubmitAnswer(playerId1, 1, [answerId1[0].answerId]);
    sleepSync(1000);
    adminQuizPlayerSubmitAnswer(playerId2, 1, [answerId1[1].answerId]);
    adminQuizSessionUpdate(token1, quizId, sessionId, 'GO_TO_ANSWER');
    adminQuizSessionUpdate(token1, quizId, sessionId, 'GO_TO_FINAL_RESULTS');

    expect(() => adminQuizCompletedQuizResults(quizId, -1, token1)).toThrow(HTTPError[400]);
  });

  test('Test Unsuccessful: Not in the Final Results State', () => {
    const sessionId = adminQuizSessionCreate(token1, quizId, 0).sessionId;
    const playerId1 = adminQuizPlayerJoin(sessionId, 'Sami').playerId;
    const playerId2 = adminQuizPlayerJoin(sessionId, 'Dun Yao').playerId;
    adminQuizSessionUpdate(token1, quizId, sessionId, 'NEXT_QUESTION');
    adminQuizSessionUpdate(token1, quizId, sessionId, 'SKIP_COUNTDOWN');
    const answerId1 = v2adminQuizInfo(token1, quizId).questions[0].answers;
    sleepSync(1);
    adminQuizPlayerSubmitAnswer(playerId1, 1, [answerId1[0].answerId]);
    sleepSync(1);
    adminQuizPlayerSubmitAnswer(playerId2, 1, [answerId1[1].answerId]);
    adminQuizSessionUpdate(token1, quizId, sessionId, 'GO_TO_ANSWER');

    expect(() => adminQuizCompletedQuizResults(quizId, sessionId, token1)).toThrow(HTTPError[400]);
  });

  test('Test Unsuccessful: Token Is Invalid', () => {
    const sessionId = adminQuizSessionCreate(token1, quizId, 0).sessionId;
    const playerId1 = adminQuizPlayerJoin(sessionId, 'Sami').playerId;
    const playerId2 = adminQuizPlayerJoin(sessionId, 'Dun Yao').playerId;
    adminQuizSessionUpdate(token1, quizId, sessionId, 'NEXT_QUESTION');
    adminQuizSessionUpdate(token1, quizId, sessionId, 'SKIP_COUNTDOWN');
    const answerId1 = v2adminQuizInfo(token1, quizId).questions[0].answers;
    sleepSync(1);
    adminQuizPlayerSubmitAnswer(playerId1, 1, [answerId1[0].answerId]);
    sleepSync(1);
    adminQuizPlayerSubmitAnswer(playerId2, 1, [answerId1[1].answerId]);
    adminQuizSessionUpdate(token1, quizId, sessionId, 'GO_TO_ANSWER');
    adminQuizSessionUpdate(token1, quizId, sessionId, 'GO_TO_FINAL_RESULTS');

    expect(() => adminQuizCompletedQuizResults(quizId, sessionId, '-1')).toThrow(HTTPError[401]);
  });

  test('Test Unsuccessful: QuizId is invalid', () => {
    const sessionId = adminQuizSessionCreate(token1, quizId, 0).sessionId;
    const playerId1 = adminQuizPlayerJoin(sessionId, 'Sami').playerId;
    const playerId2 = adminQuizPlayerJoin(sessionId, 'Dun Yao').playerId;
    adminQuizSessionUpdate(token1, quizId, sessionId, 'NEXT_QUESTION');
    adminQuizSessionUpdate(token1, quizId, sessionId, 'SKIP_COUNTDOWN');
    const answerId1 = v2adminQuizInfo(token1, quizId).questions[0].answers;
    sleepSync(1);
    adminQuizPlayerSubmitAnswer(playerId1, 1, [answerId1[0].answerId]);
    sleepSync(1);
    adminQuizPlayerSubmitAnswer(playerId2, 1, [answerId1[1].answerId]);
    adminQuizSessionUpdate(token1, quizId, sessionId, 'GO_TO_ANSWER');
    adminQuizSessionUpdate(token1, quizId, sessionId, 'GO_TO_FINAL_RESULTS');

    expect(() => adminQuizCompletedQuizResults(-1, sessionId, token1)).toThrow(HTTPError[403]);
  });

  test('Test Unsuccessful: QuizId is not Owned By User', () => {
    const token2 = adminAuthRegister('asdasd@gmail.com', 'asdasd213', 'asdasd', 'asdasdas').token;
    const sessionId = adminQuizSessionCreate(token1, quizId, 0).sessionId;
    const playerId1 = adminQuizPlayerJoin(sessionId, 'Sami').playerId;
    const playerId2 = adminQuizPlayerJoin(sessionId, 'Dun Yao').playerId;
    adminQuizSessionUpdate(token1, quizId, sessionId, 'NEXT_QUESTION');
    adminQuizSessionUpdate(token1, quizId, sessionId, 'SKIP_COUNTDOWN');
    const answerId1 = v2adminQuizInfo(token1, quizId).questions[0].answers;
    sleepSync(1);
    adminQuizPlayerSubmitAnswer(playerId1, 1, [answerId1[0].answerId]);
    sleepSync(1);
    adminQuizPlayerSubmitAnswer(playerId2, 1, [answerId1[1].answerId]);
    adminQuizSessionUpdate(token1, quizId, sessionId, 'GO_TO_ANSWER');
    adminQuizSessionUpdate(token1, quizId, sessionId, 'GO_TO_FINAL_RESULTS');

    expect(() => adminQuizCompletedQuizResults(quizId, sessionId, token2)).toThrow(HTTPError[403]);
  });
});
