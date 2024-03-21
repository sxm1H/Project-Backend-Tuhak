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

describe('adminAuthLogin', () => {
  test('Successful auth login', () => {
    const {jsonBody: {authUserId}} = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');

    adminAuthRegister('sami@gmail.com', 'sami1234', 'Sami', 'Hossein');
    adminAuthRegister('kyle1234@gmail.com', 'kyle1234', 'Kyle', 'Morley');

    const {jsonBody: {authUserIdLogin}} = adminAuthLogin('nick1234@gmail.com', 'nick1234');

    expect(authUserIdLogin).toStrictEqual(authUserId);
  });

  test('Email address does not exist', () => {
    adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const {statusCode, jsonBody} = adminAuthLogin('DunYao@gmail.com', 'nick1234');

    expect(statusCode).toStrictEqual(400);
    expect(jsonBody).toStrictEqual({
      error: expect.any(String)
    });
  });

  test('Password is not correct for the given email.', () => {
    adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const {statusCode, jsonBody} = adminAuthLogin('nick1234@gmail.com', 'notTheSamePassword');

    expect(statusCode).toStrictEqual(400);
    expect(jsonBody).toStrictEqual({
      error: expect.any(String)
    });
  });

  test('Comprehensive successful tests - testing multiple users IDs are returned correctly', () => {
    const {jsonBody: {authUserId1}} = adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo');
    const {jsonBody: {authUserId2}} = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian');
    const {jsonBody: {authUserId3}} = adminAuthRegister('Sami1234@gmail.com', 'Sami1234', 'Sami', 'Hossain');
    const {jsonBody: {authUserId4}} = adminAuthRegister('Samuel1234@gmail.com', 'Samuel1234', 'Samuel', 'Jeong');
    const {jsonBody: {authUserId5}} = adminAuthRegister('Dilhan1234@gmail.com', 'Dilhan1234', 'Dilhan', 'Mert');

    const {jsonBody: {authUserIdLogin1}} =  adminAuthLogin('dunyao@unsw.edu.au', 'abcd1234');
    const {jsonBody: {authUserIdLogin2}} = adminAuthLogin('nick1234@gmail.com', 'nick1234');
    const {jsonBody: {authUserIdLogin3}} = adminAuthLogin('Sami1234@gmail.com', 'Sami1234');
    const {jsonBody: {authUserIdLogin4}} = adminAuthLogin('Samuel1234@gmail.com', 'Samuel1234');
    const {jsonBody: {authUserIdLogin5}} = adminAuthLogin('Dilhan1234@gmail.com', 'Dilhan1234');

    expect(authUserId1).toStrictEqual(authUserIdLogin1);
    expect(authUserId2).toStrictEqual(authUserIdLogin2);
    expect(authUserId3).toStrictEqual(authUserIdLogin3);
    expect(authUserId4).toStrictEqual(authUserIdLogin4);
    expect(authUserId5).toStrictEqual(authUserIdLogin5);
  });
});
