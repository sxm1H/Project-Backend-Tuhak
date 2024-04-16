import { v2adminQuizCreate, adminQuizGetSessionStatus, v2adminQuizQuestionCreate, adminQuizSessionCreate, adminQuizThumbnailUpdate} from './v2testHelpers';
import {
  clear,
  adminAuthRegister
} from '../iteration2Tests/testHelpers';
import HTTPError from 'http-errors';

let token: string;
let quizId: number;
let validUrl: string = 'https://s3-eu-west-1.amazonaws.com/blog-ecotree/blog/0001/01/ad46dbb447cd0e9a6aeecd64cc2bd332b0cbcb79.jpeg';
let questionId: number;
let sessionId: number;
beforeEach(() => {
  clear();

  token = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian').token;
  quizId = v2adminQuizCreate(token, 'QuizName', 'QuizDescription').quizId;
  questionId = v2adminQuizQuestionCreate(quizId, token, 'question1', 5, 4, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], validUrl).questionId
  adminQuizThumbnailUpdate(quizId, token, validUrl);
  sessionId = adminQuizSessionCreate(token, quizId, 5).sessionId;
})

describe('TEST GET /v1/admin/quiz/{quizid}/session/{sessionid}', () => {
  test('Valid getSessionStatus', () => {
    expect(adminQuizGetSessionStatus(quizId, sessionId, token)).toStrictEqual({
      state: "LOBBY",
      atQuestion: 0,
      players: [],
      metadata: {
        quizId: quizId,
        name: 'QuizName',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: 'QuizDescription',
        numQuestions: 1,
        questions: expect.any(Object),
        duration: 5,
        thumbnailUrl: validUrl
      }
    });
  })
  test('invalid SessionId', () => {
    expect(() => adminQuizGetSessionStatus(quizId, sessionId + 1, token)).toThrow(HTTPError[400]);
  })

  test('token is invalid', () => {
    expect(() => adminQuizGetSessionStatus(quizId, sessionId, token + 1)).toThrow(HTTPError[401]);
  })

  test('Quiz id is not valid', () => {
    expect(() => adminQuizGetSessionStatus(quizId + 1, sessionId, token )).toThrow(HTTPError[403]);
  })
  
  test('User is not owner of quiz', () => {
    let newToken =  adminAuthRegister('pog@gmail.com', 'pogggg1234', 'pog', 'pog').token;
    expect(() => adminQuizGetSessionStatus(quizId, sessionId, newToken)).toThrow(HTTPError[403]);
  })
})