import {
  v2adminQuizCreate,
  adminQuizSessionCreate,
  v2adminQuizQuestionCreate,
  adminQuizPlayerJoin,
  adminQuizChatSend,
  adminQuizChat,
} from './v2testHelpers';
import {
  clear,
  adminAuthRegister
} from '../iteration2Tests/testHelpers';
import HTTPError from 'http-errors';

describe('adminQuizPlayerQuestionInformation', () => {
  let token: string;
  let thumbnailUrl: string;
  let quizId: number;
  let playerId: number;
  let sessionId: number;

  beforeEach(() => {
    clear();
    thumbnailUrl = 'https://www.unsw.edu.au/content/dam/images/photos/events/open-day/2020-12-homepage-update/OpenDay_2019_campaign%20-0307-crop.cropimg.width=1920.crop=square.jpg';
    const user = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    token = user.token;
    const quiz = v2adminQuizCreate(token, 'QuizName', 'QuizDescription');
    quizId = quiz.quizId;
    v2adminQuizQuestionCreate(quizId, token, 'question1', 5, 4, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], thumbnailUrl);
    v2adminQuizQuestionCreate(quizId, token, 'question5', 5, 4, [{ answer: 'Sydney', correct: true }, { answer: 'Melbourne', correct: false }], thumbnailUrl);
    sessionId = adminQuizSessionCreate(token, quizId, 5).sessionId;
    playerId = adminQuizPlayerJoin(sessionId, 'nick').playerId;
  });

  test('Successful case - no sessions yet', () => {
    expect(adminQuizChatSend(playerId, 'hello yall')).toStrictEqual({});

    expect(adminQuizChat(playerId)).toStrictEqual({
      messages: [
        {
          messageBody: 'hello yall',
          playerId: playerId,
          playerName: 'nick',
          timeSent: expect.any(Number),
        }
      ]
    });
  });

  test('Player ID Does not exist', () => {
    expect(() => adminQuizChat(1234 + playerId)).toThrow(HTTPError[400]);
  });
});
