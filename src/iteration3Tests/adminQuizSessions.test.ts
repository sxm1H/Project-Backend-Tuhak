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
        
        token = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian').token;
        quizId = v2adminQuizCreate(token, 'QuizName', 'QuizDescription').quizId;
        thumbnailUrl = 'https://www.unsw.edu.au/content/dam/images/photos/events/open-day/2020-12-homepage-update/OpenDay_2019_campaign%20-0307-crop.cropimg.width=1920.crop=square.jpg';
      });
  
      test('Successful case - no sessions yet', () => {
        const sessions = adminQuizSessions(quizId,token);
        expect(sessions).toStrictEqual({
          activeSessions: [],
          inactiveSessions: []
        });
      });
      test('Token is invalid', () => {
        const invalidToken = 'invalid-token';
        expect(() => adminQuizSessions(quizId,invalidToken)).toThrow(HTTPError[401]);
        
      });
    
      test('Quiz ID is invalid', () => {
        const invalidQuizId = 99999; // assuming 99999 is not a valid quizId
        expect(() => adminQuizSessions(invalidQuizId, token)).toThrow(HTTPError[403]);
       
      });
    
      test('User does not own the quiz', () => {
        // Register a different user
        const otherUser = adminAuthRegister('otheruser@gmail.com', 'password123', 'Other', 'User');
        const otherToken = otherUser.token;
    
        expect(() => adminQuizSessions(quizId,otherToken )).toThrow(HTTPError[403]);
       
      });
      test('Handles active and inactive sessions correctly', () => {
        // Assuming functions to start or end quiz sessions are available and work as follows:
        // startQuizSession(token, quizId) -> returns sessionId
        // endQuizSession(token, sessionId)
        
        const response = v2AdminQuizQuestionCreate(quizId, token, 'question1', 5, 4, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], thumbnailUrl);
        const sessionId1 = adminQuizSessionCreate(token, quizId,3).sessionId; // Start first session
        const sessionId2 = adminQuizSessionCreate(token, quizId,6).sessionId; // Start second session
        adminQuizSessionUpdate(token,quizId, sessionId2, States.END); // End second session
    
        const sessions = adminQuizSessions(quizId,token);
        expect(sessions.activeSessions).toContain(sessionId1);
        expect(sessions.inactiveSessions).toContain(sessionId2);
      });
      
  
    
    test('Quiz ID does not refer to a valid quiz.', () => {
      v2adminQuizRemove(token, quizId);
      expect(() => adminQuizSessionCreate(token, quizId, 3)).toThrow(HTTPError[400]);
    });

    // Need to make another one that uses question create, since quiz does not have any questions
    // error
  

  });
