import {adminAuthRegister} from './auth.js';
import {
  adminQuizNameUpdate,
  adminQuizRemove,
  adminQuizList,
  adminQuizInfo,
  adminQuizDescriptionUpdate,
  adminQuizCreate
} from './quiz.js';
import {clear} from './other.js';

beforeEach(() => {
  clear();
});

describe('adminQuizList', () => {

  test('Non valid User Id', () => {
    let quizList1 = adminQuizList(999999999999999);
    
    expect(quizList1.error).toEqual(expect.any(String));
    
    let quizList2 = adminQuizList(-1);
    
    expect(quizList2.error).toEqual(expect.any(String));
    
    let userId = adminAuthRegister('pain@gmail.com', 'Wowowowow123', 'Alex', 'Hirsch');
    let quizList3 = adminQuizList(userId.authUserId + 1);
    
    expect(quizList3.error).toEqual(expect.any(String));
  });

  test('User Id Quiz List successfully accessed', () => {
    let userId = adminAuthRegister('pogchamp@gmail.com', 'thisisvalidpassword1', 'Steve', 'Jobs');
    let quizListEmpty = adminQuizList(userId.authUserId);
		
    expect(quizListEmpty).toStrictEqual({
      quizzes: []
    });

    let quizId = adminQuizCreate(userId.authUserId, 'creative name', 'description');
    let quizList = adminQuizList(userId.authUserId);
    
    expect(quizList).toStrictEqual({
      quizzes: [
        {
          quizId: quizId.quizId,
          name: 'creative name'
        }
      ]
    });
  });
});