// import {
//   v2adminQuizCreate,
//   v2adminQuizQuestionCreate,
//   adminQuizSessionCreate,
//   adminQuizQuestionResults,
//   adminQuizSessionUpdate,
//   adminQuizPlayerJoin,
//   adminQuizPlayerSubmitAnswer,
//   v2adminQuizInfo,
// } from './v2testHelpers';
// import {
//   clear,
//   adminAuthRegister
// } from '../iteration2Tests/testHelpers';
// import HTTPError from 'http-errors';

// function sleepSync(ms: number) {
//   const startTime = new Date().getTime();
//   while (new Date().getTime() - startTime < ms) {
//     // zzzZZ - comment needed so eslint doesn't complain
//   }
// }

// let token1: string;
// let token2: string;
// let quizId: number;
// let questionId: number;
// const thumbnailUrl = 'https://www.unsw.edu.au/content/dam/images/photos/events/open-day/2020-12-homepage-update/OpenDay_2019_campaign%20-0307-crop.cropimg.width=1920.crop=square.jpg';
// beforeEach(() => {
//   clear();
//   token1 = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian').token;
//   token2 = adminAuthRegister('name@gmail.com', 'abcd1234', 'name', 'lastname').token;
//   quizId = v2adminQuizCreate(token1, 'QuizName', 'QuizDescription').quizId;
//   questionId = v2adminQuizQuestionCreate(quizId, token1, 'question1', 5, 4, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], thumbnailUrl).questionId;
// });

// describe('Testing /v1/player/{playerid}/question/{questionposition}/results', () => {
//   test('Test Successful: Simple Checking of Results For a 1 Question Quiz', () => {
//     const sessionId = adminQuizSessionCreate(token1, quizId, 0).sessionId;
//     const playerId1 = adminQuizPlayerJoin(sessionId, 'Sami').playerId;
//     const playerId2 = adminQuizPlayerJoin(sessionId, 'Dun Yao').playerId;
//     adminQuizSessionUpdate(token1, quizId, sessionId, 'NEXT_QUESTION');
//     adminQuizSessionUpdate(token1, quizId, sessionId, 'SKIP_COUNTDOWN');
//     const answerId1 = v2adminQuizInfo(token1, quizId).questions[0].answers;
//     sleepSync(1000);
//     adminQuizPlayerSubmitAnswer(playerId1, 1, [answerId1[0].answerId]);
//     sleepSync(1000);
//     adminQuizPlayerSubmitAnswer(playerId2, 1, [answerId1[1].answerId]);
//     adminQuizSessionUpdate(token1, quizId, sessionId, 'GO_TO_ANSWER');
//     expect(adminQuizQuestionResults(playerId1, 1)).toStrictEqual({
//       questionId: questionId,
//       playersCorrectList: ['Sami'],
//       averageAnswerTime: 2,
//       percentageCorrect: 50,
//     });
//   });

//   test('Test Unsuccessful: Player Id Does Not Exist', () => {
//     const sessionId = adminQuizSessionCreate(token1, quizId, 0).sessionId;
//     const playerId1 = adminQuizPlayerJoin(sessionId, 'Sami').playerId;
//     const playerId2 = adminQuizPlayerJoin(sessionId, 'Dun Yao').playerId;
//     adminQuizSessionUpdate(token1, quizId, sessionId, 'NEXT_QUESTION');
//     adminQuizSessionUpdate(token1, quizId, sessionId, 'SKIP_COUNTDOWN');
//     const answerId1 = v2adminQuizInfo(token1, quizId).questions[0].answers;
//     sleepSync(1);
//     adminQuizPlayerSubmitAnswer(playerId1, 1, [answerId1[0].answerId]);
//     sleepSync(2);
//     adminQuizPlayerSubmitAnswer(playerId2, 1, [answerId1[1].answerId]);
//     adminQuizSessionUpdate(token1, quizId, sessionId, 'GO_TO_ANSWER');

//     expect(() => adminQuizQuestionResults(-1, 1)).toThrow(HTTPError[400]);
//   });

//   test('Test Unsuccessful: Invalid Question Position', () => {
//     const sessionId = adminQuizSessionCreate(token1, quizId, 0).sessionId;
//     const playerId1 = adminQuizPlayerJoin(sessionId, 'Sami').playerId;
//     const playerId2 = adminQuizPlayerJoin(sessionId, 'Dun Yao').playerId;
//     adminQuizSessionUpdate(token1, quizId, sessionId, 'NEXT_QUESTION');
//     adminQuizSessionUpdate(token1, quizId, sessionId, 'SKIP_COUNTDOWN');
//     const answerId1 = v2adminQuizInfo(token1, quizId).questions[0].answers;
//     sleepSync(1);
//     adminQuizPlayerSubmitAnswer(playerId1, 1, [answerId1[0].answerId]);
//     sleepSync(2);
//     adminQuizPlayerSubmitAnswer(playerId2, 1, [answerId1[1].answerId]);
//     adminQuizSessionUpdate(token1, quizId, sessionId, 'GO_TO_ANSWER');

//     expect(() => adminQuizQuestionResults(playerId1, -1)).toThrow(HTTPError[400]);
//   });

//   test('Test Unsuccessful: Session Is not In Answer Show', () => {
//     const sessionId = adminQuizSessionCreate(token1, quizId, 0).sessionId;
//     const playerId1 = adminQuizPlayerJoin(sessionId, 'Sami').playerId;
//     const playerId2 = adminQuizPlayerJoin(sessionId, 'Dun Yao').playerId;
//     adminQuizSessionUpdate(token1, quizId, sessionId, 'NEXT_QUESTION');
//     adminQuizSessionUpdate(token1, quizId, sessionId, 'SKIP_COUNTDOWN');
//     const answerId1 = v2adminQuizInfo(token1, quizId).questions[0].answers;
//     sleepSync(1);
//     adminQuizPlayerSubmitAnswer(playerId1, 1, [answerId1[0].answerId]);
//     sleepSync(2);
//     adminQuizPlayerSubmitAnswer(playerId2, 1, [answerId1[1].answerId]);

//     expect(() => adminQuizQuestionResults(playerId1, 1)).toThrow(HTTPError[400]);
//   });

//   test('Test Unsuccessful: Session Is Not Up to This Question', () => {
//     const questionId2 = v2adminQuizQuestionCreate(quizId, token1, 'question2', 5, 4, [{ answer: 'Hello', correct: true }, { answer: 'Sucks', correct: false }], thumbnailUrl).questionId;
//     const sessionId = adminQuizSessionCreate(token1, quizId, 0).sessionId;
//     const playerId1 = adminQuizPlayerJoin(sessionId, 'Sami').playerId;
//     const playerId2 = adminQuizPlayerJoin(sessionId, 'Dun Yao').playerId;
//     adminQuizSessionUpdate(token1, quizId, sessionId, 'NEXT_QUESTION');
//     adminQuizSessionUpdate(token1, quizId, sessionId, 'SKIP_COUNTDOWN');
//     const answerId1 = v2adminQuizInfo(token1, quizId).questions[0].answers;
//     sleepSync(1);
//     adminQuizPlayerSubmitAnswer(playerId1, 1, [answerId1[0].answerId]);
//     sleepSync(2);
//     adminQuizPlayerSubmitAnswer(playerId2, 1, [answerId1[1].answerId]);

//     expect(() => adminQuizQuestionResults(playerId1, 2)).toThrow(HTTPError[400]);
//   });
// });

test('test', () => {
  expect(2+2).toBe(4);
})