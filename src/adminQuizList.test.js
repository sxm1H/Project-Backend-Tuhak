import { clear } from './other';
import { adminAuthRegister } from './auth';
import {
  adminQuizNameUpdate,
  adminQuizRemove,
  adminQuizList,
  adminQuizInfo,
  adminQuizDescriptionUpdate,
  adminQuizCreate
} from './quiz';
import {
  requestHelper,
  clear,
  adminAuthRegister,
  adminAuthLogin,
  adminUserDetails,
  adminUserDetailsUpdate,
  adminUserPasswordUpdate,
  adminQuizList,
  adminQuizCreate,
  adminQuizRemove,
  adminQuizInfo,
  adminQuizNameUpdate,
  adminQuizDescriptionUpdate
} from './testHelpers';

beforeEach(() => {
  clear();
});

describe('adminQuizList', () => {
  test('Non valid User Id', () => {
    const quizList1 = adminQuizList(999999999999999);

    expect(quizList1.error).toEqual(expect.any(String));

    const quizList2 = adminQuizList(-1);

    expect(quizList2.error).toEqual(expect.any(String));

    const userId = adminAuthRegister('pain@gmail.com', 'Wowowowow123', 'Alex', 'Hirsch');
    const quizList3 = adminQuizList(userId.authUserId + 1);

    expect(quizList3.error).toEqual(expect.any(String));
  });

  test('User Id Quiz List successfully accessed', () => {
    const userId = adminAuthRegister('pogchamp@gmail.com', 'thisisvalidpassword1', 'Steve', 'Jobs');
    const quizListEmpty = adminQuizList(userId.authUserId);

    expect(quizListEmpty).toStrictEqual({
      quizzes: []
    });

    const quizId = adminQuizCreate(userId.authUserId, 'creative name', 'description');
    const quizList = adminQuizList(userId.authUserId);

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
