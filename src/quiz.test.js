import { adminQuizRemove } from './quiz.js';
import { clear } from './other.js'

describe('adminQuizRemove', () => {
    test('authUserId is not a valid user', () => {
      clear()

      let userId = adminAuthRegister('nick@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
      let quiz = adminQuizCreate(userId.authUserId, 'Cities of Australia', 'good quiz');

      let error = adminQuizRemove(1234, quiz.quizId); // 1234 being an obvious not authorised ID.

      expect(error).toStrictEqual({error: 'AuthUserId is not a valid user.'});

    });
    test('QuizId is not a valid quiz Error', () => {
        clear()

        let userId = adminAuthRegister('nick@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    
        let error = adminQuizRemove(userId.authUserId, 1234); // 1234 being an obvious not authorised quizId.
  
        expect(error).toStrictEqual({error: 'Quiz ID does not refer to a valid quiz.'});
    });
    test('QuizId is not a valid quiz Error', () => {
        clear()

        let userId = adminAuthRegister('nick@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
        let userId2 = adminAuthRegister('DunYao@gmail.com', 'DunYao1234', 'DunYao', 'Foo');
    
        let quiz = adminQuizCreate(userId.authUserId, 'Cities of Australia', 'good quiz'); // nick's quiz

        let error = adminQuizRemove(userId2.authUserId, quiz.quizId); // userId2 is Dun Yao
  
        expect(error).toStrictEqual({error: 'Quiz ID does not refer to a quiz that this user owns.'});
    });
  });