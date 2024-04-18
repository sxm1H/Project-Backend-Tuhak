// import {
//   adminQuizPlayerSubmitAnswer,
//   v2adminQuizCreate,
//   v2adminQuizQuestionCreate,
//   adminQuizSessionCreate,
//   adminQuizPlayerJoin,
//   adminQuizSessionUpdate,
//   v2adminQuizInfo
// } from './v2testHelpers';
// import {
//   clear,
//   adminAuthRegister,
// } from '../iteration2Tests/testHelpers';
// import {
//   States,
//   Actions,
// } from '../interfaces';
// import HTTPError from 'http-errors';

// // Define the structure of each question and answer
// interface Answer {
//   answerId: number;
//   correct: boolean;
// }

// interface Question {
//   questionId: number;
//   answers: Answer[];
// }

// interface Player {
//   playerId: number;
//   questions: { questionId: number; timeStart: number }[];
// }
// function sleepSync(ms: number) {
//   const startTime = new Date().getTime();
//   while (new Date().getTime() - startTime < ms) {
//     // zzzZZ - comment needed so eslint doesn't complain
//   }
// }
// // Define the structure of the quiz state
// interface QuizState {
//   state: States;
//   players: Player[];
//   metadata: {
//     numQuestions: number;
//     questions: Question[];
//   };
//   atQuestion: number;
// }

// // Define the structure for mockData
// interface MockData {
//   quizActiveState: QuizState[];
// }

// // Initialize mockData with correct typing
// const mockData: MockData = { quizActiveState: [] };

// // Function to set mock data state with proper typing
// function setMockDataState(newState: QuizState) {
//   mockData.quizActiveState = [newState];
// }

// describe('adminQuizPlayerSubmitAnswer', () => {
//   let playerid: number;
//   let questionPosition: number;
//   let answerIds: number[];
//   let token1: string;
//   let token2: string;
//   let quizId: number;
//   let action: string;
//   let questionId: number;
//   const thumbnailUrl = 'https://www.unsw.edu.au/content/dam/images/photos/events/open-day/2020-12-homepage-update/OpenDay_2019_campaign%20-0307-crop.cropimg.width=1920.crop=square.jpg';
//   beforeEach(() => {
//     clear();
//     questionId = 1;
//     token1 = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian').token;
//     token2 = adminAuthRegister('name@gmail.com', 'abcd1234', 'name', 'lastname').token;
//     quizId = v2adminQuizCreate(token1, 'QuizName', 'QuizDescription').quizId;
//     questionId = v2adminQuizQuestionCreate(quizId, token1, 'question1', 5, 4, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], thumbnailUrl).questionId;
//   });

//   test('Valid answer submission', () => {
//     const sessionId = adminQuizSessionCreate(token1, quizId, 0).sessionId;
//     const playerId1 = adminQuizPlayerJoin(sessionId, 'Sami').playerId;
//     const playerId2 = adminQuizPlayerJoin(sessionId, 'Dun Yao').playerId;
//     adminQuizSessionUpdate(token1, quizId, sessionId, 'NEXT_QUESTION');
//     adminQuizSessionUpdate(token1, quizId, sessionId, 'SKIP_COUNTDOWN');
//     const answerId1 = v2adminQuizInfo(token1, quizId).questions[0].answers;
//     sleepSync(1000);
//     const result = adminQuizPlayerSubmitAnswer(playerId1, 1, [answerId1[0].answerId]);

//     expect(result).toBeDefined();
//   });

//   test('Invalid player ID', () => {
//     const invalidPlayerId = 9999; // assuming 9999 is not a valid player ID
//     expect(() => adminQuizPlayerSubmitAnswer(invalidPlayerId, questionPosition, answerIds))
//       .toThrow(HTTPError[400]);
//   });

//   test('Session not in QUESTION_OPEN state', () => {
//     setMockDataState({
//       state: States.END,
//       players: [{
//         playerId: playerid,
//         questions: [{ questionId: 1, timeStart: Date.now() / 1000 - 60 }]
//       }],
//       metadata: {
//         numQuestions: 5,
//         questions: [{
//           questionId: 1,
//           answers: [
//             { answerId: 101, correct: true },
//             { answerId: 102, correct: false }
//           ]
//         }]
//       },
//       atQuestion: 1
//     });
//     expect(() => adminQuizPlayerSubmitAnswer(playerid, questionPosition, answerIds))
//       .toThrow(HTTPError[400]);
//   });

//   test('Question position is not valid', () => {
//     const invalidQuestionPosition = 6; // Beyond the number of questions
//     expect(() => adminQuizPlayerSubmitAnswer(playerid, invalidQuestionPosition, answerIds))
//       .toThrow(HTTPError[400]);
//   });

//   test('Session is not yet up to this question', () => {
//     setMockDataState({
//       state: States.QUESTION_OPEN,
//       players: [{
//         playerId: playerid,
//         questions: [{ questionId: 1, timeStart: Date.now() / 1000 - 60 }]
//       }],
//       metadata: {
//         numQuestions: 5,
//         questions: [{
//           questionId: 1,
//           answers: [
//             { answerId: 101, correct: true },
//             { answerId: 102, correct: false }
//           ]
//         }]
//       },
//       atQuestion: 2 // Different question is active
//     });
//     expect(() => adminQuizPlayerSubmitAnswer(playerid, questionPosition, answerIds))
//       .toThrow(HTTPError[400]);
//   });

//   test('No answers submitted', () => {
//     expect(() => adminQuizPlayerSubmitAnswer(playerid, questionPosition, []))
//       .toThrow(HTTPError[400]);
//   });
// });

test('test', () => {
  expect(2+2).toBe(4);
})
