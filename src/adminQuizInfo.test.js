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

describe('adminQuizInfo', () => {

  let authUserId;
  let quizId;
  beforeEach(() => {
    authUserId = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
    quizId = adminQuizCreate(authUserId.authUserId, 'quiz1', 'lorem ipsum');
  });

  test('Success', () => {
    expect(adminQuizInfo(authUserId.authUserId, quizId.quizId)).toStrictEqual(
      {
        quizId: expect.any(Number),
        name: expect.any(String),
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: expect.any(String),
      }
    );
  });

  test('Invalid AuthUserId', () => {
    let info = adminQuizInfo(-2, quizId.quizId);
    expect(info.error).toStrictEqual(expect.any(String));
  });

  test('Invalid quizId)', () => {
    let info = adminQuizInfo(authUserId.authUserId, -2);
    expect(info.error).toStrictEqual(expect.any(String));
  });

  test('User does not own quiz', () => {
    let authUserId2 = adminAuthRegister('sami@unsw.edu.au', '1234abcd', 'Sami', 'Hossain');
    let info = adminQuizInfo(authUserId2.authUserId, quizId.quizId);
    expect(info.error).toStrictEqual(expect.any(String));
  });
});