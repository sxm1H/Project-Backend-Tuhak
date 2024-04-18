import {
  v2adminQuizCreate,
  v2adminQuizQuestionCreate,
  adminQuizSessionCreate,
  adminQuizQuestionResults,
  adminQuizSessionUpdate,
  adminQuizPlayerJoin,
  adminQuizPlayerSubmitAnswer,
  v2adminQuizInfo,
  adminQuizFinalResults,
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
let token2: string;
let quizId: number;
let questionId: number;
let questionId2: number;
const thumbnailUrl = 'https://www.unsw.edu.au/content/dam/images/photos/events/open-day/2020-12-homepage-update/OpenDay_2019_campaign%20-0307-crop.cropimg.width=1920.crop=square.jpg';
beforeEach(() => {
  clear();
  token1 = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian').token;
  token2 = adminAuthRegister('name@gmail.com', 'abcd1234', 'name', 'lastname').token;
  quizId = v2adminQuizCreate(token1, 'QuizName', 'QuizDescription').quizId;
  questionId = v2adminQuizQuestionCreate(quizId, token1, 'question1', 5, 4, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], thumbnailUrl).questionId;
  questionId2 = v2adminQuizQuestionCreate(quizId, token1, 'question1', 5, 4, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], thumbnailUrl).questionId;
});

describe('Testing /v1/{playerid}/results', () => {
  test('Test Successful: Simple Get Final Results for 1 Question Quiz', () => {
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
    adminQuizSessionUpdate(token1, quizId, sessionId, 'NEXT_QUESTION');
    adminQuizSessionUpdate(token1, quizId, sessionId, 'SKIP_COUNTDOWN');
    const answerId2 = v2adminQuizInfo(token1, quizId).questions[1].answers;
    sleepSync(1000);
    adminQuizPlayerSubmitAnswer(playerId1, 2, [answerId2[0].answerId]);
    sleepSync(1000);
    adminQuizPlayerSubmitAnswer(playerId2, 2, [answerId2[0].answerId]);
    adminQuizSessionUpdate(token1, quizId, sessionId, 'GO_TO_ANSWER');
    adminQuizSessionUpdate(token1, quizId, sessionId, 'GO_TO_FINAL_RESULTS');
    expect(adminQuizFinalResults(playerId1)).toStrictEqual({
      usersRankedByScore: [{ name: 'Sami', score: expect.any(Number) }, { name: 'Dun Yao', score: expect.any(Number) }],
      questionResults: [
        {
          questionId: questionId,
          playersCorrectList: ['Sami'],
          averageAnswerTime: 2,
          percentageCorrect: 50,
        },
        {
          questionId: questionId2,
          playersCorrectList: ['Sami', 'Dun Yao'],
          averageAnswerTime: 2,
          percentageCorrect: 100,
        },
      ]
    });
  });

  test('Test Unsuccessful: Player Id does not exist', () => {
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

    expect(() => adminQuizFinalResults(-1)).toThrow(HTTPError[400]);
  });

  test('Test Unsuccessful: Quiz Not in FINAL_RESULTS state', () => {
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

    expect(() => adminQuizFinalResults(playerId1)).toThrow(HTTPError[400]);
  });
});

