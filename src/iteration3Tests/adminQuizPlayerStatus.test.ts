import {
    v2adminQuizCreate,
    adminQuizSessions,
    adminQuizSessionCreate,
    adminQuizSessionUpdate,
    v2adminQuizQuestionCreate,
    v2adminQuizRemove,
    adminQuizPlayerStatus,
    adminQuizPlayerJoin,
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
  
  describe('adminQuizPlayerStatus', () => {
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
      v2adminQuizQuestionCreate(quizId, token, 'question1', 5, 4, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], thumbnailUrl);
      v2adminQuizQuestionCreate(quizId, token, 'question5', 5, 4, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], thumbnailUrl);
    });
  
    test('Successful case - no sessions yet', () => {
      const sessionId = adminQuizSessionCreate(token, quizId, 5).sessionId;
      const playerId = adminQuizPlayerJoin(sessionId, 'nick').playerId;
      const object = adminQuizPlayerStatus(playerId);
      expect(object).toStrictEqual({
        state: "LOBBY",
        numQuestions: 2,
        atQuestion: 0,
      })
      
    });
  
    test('Player ID Does not exist', () => {
      expect(() => adminQuizPlayerStatus(1234)).toThrow(HTTPError[400]);
    });
  });
  