import {
    adminQuizPlayerSubmitAnswer,
    v2adminQuizCreate,
    v2adminQuizQuestionCreate,
    adminQuizSessionCreate,
    adminQuizPlayerJoin,
    adminQuizSessionUpdate,
    v2adminQuizInfo
  } from './v2testHelpers';
  import {
    clear,
    adminAuthRegister
  } from '../iteration2Tests/testHelpers';
  import HTTPError from 'http-errors';


  let token1: string;
  let token2: string;
  let quizId: number;
  let action: string;
  let questionId: number;
  let thumbnailUrl = 'https://www.unsw.edu.au/content/dam/images/photos/events/open-day/2020-12-homepage-update/OpenDay_2019_campaign%20-0307-crop.cropimg.width=1920.crop=square.jpg';


    
  describe('adminQuizSessionJoin', () => {
    beforeEach(() => {
      clear();

      questionId = 1;
      token1 = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian').token;
      token2 = adminAuthRegister('name@gmail.com', 'abcd1234', 'name', 'lastname').token;
      quizId = v2adminQuizCreate(token1, 'QuizName', 'QuizDescription').quizId;
      questionId = v2adminQuizQuestionCreate(quizId, token1, 'question1', 5, 4, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], thumbnailUrl).questionId;
    });
    test('Valid join to session', () => {
      const sessionId = adminQuizSessionCreate(token1, quizId,  0).sessionId;;
      const result = adminQuizPlayerJoin(sessionId, 'Dilhan').playerId;
      expect(result).toStrictEqual(expect.any(Number));
    });
    
    test('Invalid session ID', () => {
      const sessionId = 2187129231879;
      
      expect(() => adminQuizPlayerJoin(sessionId, 'Dilhan')).toThrow(HTTPError[400]);
    });

    test('Session not in lobby state', () => {
      const sessionId = adminQuizSessionCreate(token1, quizId,  0).sessionId;
      adminQuizSessionUpdate(token1,quizId,sessionId,'NEXT_QUESTION')
      expect(() => adminQuizPlayerJoin(sessionId, 'Dilhan')).toThrow(HTTPError[400]);
      
    });
    test('Duplicate player name in the session', () => {
      const sessionId = adminQuizSessionCreate(token1, quizId,  0).sessionId;;
      adminQuizPlayerJoin(sessionId, 'Dilhan').playerId;
      
      expect(() => adminQuizPlayerJoin(sessionId, 'Dilhan')).toThrow(HTTPError[400]);
      
    });
    test('Empty name generates a random name', () => {
      const sessionId = adminQuizSessionCreate(token1, quizId, 0).sessionId;
      const emptyName = '';
      const result = adminQuizPlayerJoin(sessionId, emptyName).playerId;
      expect(result).toStrictEqual(expect.any(Number));
    });
  });

