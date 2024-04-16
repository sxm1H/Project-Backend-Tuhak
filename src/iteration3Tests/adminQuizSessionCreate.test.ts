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

  let token: string;
  let quizId: number;
  let thumbnailUrl: string;
  beforeEach(() => {
    clear();
    
    
    token = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian').token;
    quizId = v2adminQuizCreate(token, 'QuizName', 'QuizDescription').quizId;
    thumbnailUrl = 'https://www.unsw.edu.au/content/dam/images/photos/events/open-day/2020-12-homepage-update/OpenDay_2019_campaign%20-0307-crop.cropimg.width=1920.crop=square.jpg';
    v2AdminQuizQuestionCreate(quizId, token, 'question1', 5, 4, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], thumbnailUrl);
  
    describe('adminQuizSessionStart', () => {
    test('Successful test case', () => {
      expect(adminQuizSessionCreate(token, quizId, 3)).toStrictEqual({});
    });
  
    test('autoStartNum being greater than 50', () => {
      expect(() => adminQuizSessionCreate(token, quizId, 51)).toThrow(HTTPError[400]);
    });
  
    
    test('Quiz ID does not refer to a valid quiz.', () => {
      v2adminQuizRemove(token, quizId);
      expect(() => adminQuizSessionCreate(token, quizId, 3)).toThrow(HTTPError[400]);
    });

    // Need to make another one that uses question create, since quiz does not have any questions
    // error
  

  });
  
