import {
    v2adminQuizCreate,
    v2adminQuizQuestionCreate,
    adminQuizSessionCreate,
    adminQuizSessionUpdate,
    adminQuizPlayerJoin,
    adminQuizPlayerSubmitAnswer,
    v2adminQuizInfo,
    adminQuizFinalResultsCSV,
  } from './v2testHelpers';
  import {
    clear,
    adminAuthRegister
  } from '../iteration2Tests/testHelpers';
  import HTTPError from 'http-errors';
  
  const fs = require('fs');
  function sleepSync(ms: number) {
    const startTime = new Date().getTime();
    while (new Date().getTime() - startTime < ms) {
      // zzzZZ - comment needed so eslint doesn't complain
    }
  }

  const thumbnailUrl = 'https://www.unsw.edu.au/content/dam/images/photos/events/open-day/2020-12-homepage-update/OpenDay_2019_campaign%20-0307-crop.cropimg.width=1920.crop=square.jpg';
  let token1: string;
  let quizId: number;
  let questionId: number;
  let questionId2: number;
  beforeEach(() => {
    clear();
  
    token1 = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian').token;
    quizId = v2adminQuizCreate(token1, 'QuizName', 'QuizDescription').quizId;
    questionId = v2adminQuizQuestionCreate(quizId, token1, 'question1', 5, 4, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], thumbnailUrl).questionId;
    questionId2 = v2adminQuizQuestionCreate(quizId, token1, 'question2', 5, 4, [{ answer: 'Croatia', correct: true }, { answer: 'Dubai', correct: false }], thumbnailUrl).questionId;
  });

describe('Testing /v1/admin/quiz/{quizid}/session/{sessionid)/results/csv', () => {
    test('Test Successful: Creating a CSV file for a 2 Question Quiz', () => {
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
        const url = adminQuizFinalResultsCSV(quizId, sessionId, token1);
        expect(url).toStrictEqual(expect.any(String));
    })

    test('Test Unsuccessful: SessionId does not Refer to a Valid Quiz', () => {
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
        adminQuizSessionUpdate(token1, quizId, sessionId, 'NEXT_QUESTION');
        adminQuizSessionUpdate(token1, quizId, sessionId, 'SKIP_COUNTDOWN');
        const answerId2 = v2adminQuizInfo(token1, quizId).questions[1].answers;
        sleepSync(1);
        adminQuizPlayerSubmitAnswer(playerId1, 2, [answerId2[0].answerId]);
        sleepSync(1);
        adminQuizPlayerSubmitAnswer(playerId2, 2, [answerId2[0].answerId]);
        adminQuizSessionUpdate(token1, quizId, sessionId, 'GO_TO_ANSWER');
        adminQuizSessionUpdate(token1, quizId, sessionId, 'GO_TO_FINAL_RESULTS');
        
        expect(() => adminQuizFinalResultsCSV(quizId, -1, token1)).toThrow(HTTPError[400]);
    })

    test('Test Unsuccessful: Session Is Not In FINAL_RESULTS state', () => {
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
        adminQuizSessionUpdate(token1, quizId, sessionId, 'NEXT_QUESTION');
        adminQuizSessionUpdate(token1, quizId, sessionId, 'SKIP_COUNTDOWN');
        const answerId2 = v2adminQuizInfo(token1, quizId).questions[1].answers;
        sleepSync(1);
        adminQuizPlayerSubmitAnswer(playerId1, 2, [answerId2[0].answerId]);
        sleepSync(1);
        adminQuizPlayerSubmitAnswer(playerId2, 2, [answerId2[0].answerId]);
        adminQuizSessionUpdate(token1, quizId, sessionId, 'GO_TO_ANSWER');
        
        expect(() => adminQuizFinalResultsCSV(quizId, sessionId, token1)).toThrow(HTTPError[400]);
    })

    test('Test Unsuccessful: Token is Inalid', () => {
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
        adminQuizSessionUpdate(token1, quizId, sessionId, 'NEXT_QUESTION');
        adminQuizSessionUpdate(token1, quizId, sessionId, 'SKIP_COUNTDOWN');
        const answerId2 = v2adminQuizInfo(token1, quizId).questions[1].answers;
        sleepSync(1);
        adminQuizPlayerSubmitAnswer(playerId1, 2, [answerId2[0].answerId]);
        sleepSync(1);
        adminQuizPlayerSubmitAnswer(playerId2, 2, [answerId2[0].answerId]);
        adminQuizSessionUpdate(token1, quizId, sessionId, 'GO_TO_ANSWER');
        adminQuizSessionUpdate(token1, quizId, sessionId, 'GO_TO_FINAL_RESULTS');

        expect(() => adminQuizFinalResultsCSV(quizId, sessionId, '')).toThrow(HTTPError[401]);
    })

    test('Test Unsuccessful: User Is Not an Owner of the Quiz', () => {
        const token2 = adminAuthRegister('asdasd@gmail.com', 'asdasd12312', 'asdasd', 'asdasd').token;
        const quizId1 = v2adminQuizCreate(token2, 'QuizId2', 'asads').quizId;
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
        adminQuizSessionUpdate(token1, quizId, sessionId, 'NEXT_QUESTION');
        adminQuizSessionUpdate(token1, quizId, sessionId, 'SKIP_COUNTDOWN');
        const answerId2 = v2adminQuizInfo(token1, quizId).questions[1].answers;
        sleepSync(1);
        adminQuizPlayerSubmitAnswer(playerId1, 2, [answerId2[0].answerId]);
        sleepSync(1);
        adminQuizPlayerSubmitAnswer(playerId2, 2, [answerId2[0].answerId]);
        adminQuizSessionUpdate(token1, quizId, sessionId, 'GO_TO_ANSWER');
        adminQuizSessionUpdate(token1, quizId, sessionId, 'GO_TO_FINAL_RESULTS');

        expect(() => adminQuizFinalResultsCSV(quizId1, sessionId, token1)).toThrow(HTTPError[403]);
    })

    test('Test Unsuccessful: QuizId Does Not Exist', () => {
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
        adminQuizSessionUpdate(token1, quizId, sessionId, 'NEXT_QUESTION');
        adminQuizSessionUpdate(token1, quizId, sessionId, 'SKIP_COUNTDOWN');
        const answerId2 = v2adminQuizInfo(token1, quizId).questions[1].answers;
        sleepSync(1);
        adminQuizPlayerSubmitAnswer(playerId1, 2, [answerId2[0].answerId]);
        sleepSync(1);
        adminQuizPlayerSubmitAnswer(playerId2, 2, [answerId2[0].answerId]);
        adminQuizSessionUpdate(token1, quizId, sessionId, 'GO_TO_ANSWER');
        adminQuizSessionUpdate(token1, quizId, sessionId, 'GO_TO_FINAL_RESULTS');

        expect(() => adminQuizFinalResultsCSV(-1, sessionId, token1)).toThrow(HTTPError[403]);
    })

    test('Test Unsuccessful: User enters Valid QuizId which they own, but this is not the current session', () => {
        const quizId1 = v2adminQuizCreate(token1, 'QuizId2', 'adasasd').quizId;
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
        adminQuizSessionUpdate(token1, quizId, sessionId, 'NEXT_QUESTION');
        adminQuizSessionUpdate(token1, quizId, sessionId, 'SKIP_COUNTDOWN');
        const answerId2 = v2adminQuizInfo(token1, quizId).questions[1].answers;
        sleepSync(1);
        adminQuizPlayerSubmitAnswer(playerId1, 2, [answerId2[0].answerId]);
        sleepSync(1);
        adminQuizPlayerSubmitAnswer(playerId2, 2, [answerId2[0].answerId]);
        adminQuizSessionUpdate(token1, quizId, sessionId, 'GO_TO_ANSWER');
        adminQuizSessionUpdate(token1, quizId, sessionId, 'GO_TO_FINAL_RESULTS');

        expect(() => adminQuizFinalResultsCSV(quizId1, sessionId, token1)).toThrow(HTTPError[400]);
    })
})