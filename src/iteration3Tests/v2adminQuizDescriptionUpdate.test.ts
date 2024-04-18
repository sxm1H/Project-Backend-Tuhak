import {
  v2adminQuizCreate,
  adminQuizDescriptionUpdate,
  v2adminQuizInfo,
} from './v2testHelpers';
import {
  clear,
  adminAuthRegister,
} from '../iteration2Tests/testHelpers';

import HTTPError from 'http-errors';

let token: string;
let quizId: number;
beforeEach(() => {
  clear();

  token = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh').token;
  quizId = v2adminQuizCreate(token, 'Australian Cities', 'lorem ipsum').quizId;
});

describe('Testing PUT v1/admin/quiz/:quizid/description', () => {
  test('Comprehensive Test Successful: Using Quiz Info to check whether the desc has been updated', () => {
    expect(adminQuizDescriptionUpdate(token, quizId, 'lorem ipsum decorum')).toStrictEqual({});

    const response = v2adminQuizInfo(token, quizId);
    expect(response.description).toStrictEqual('lorem ipsum decorum');
  });

  test('Comprehensive Test Successful: Using Quiz Info to check updated desc when the user has multiple quizzes.', () => {
    const token1 = adminAuthRegister('abcd@gmail.com', 'abcd1234', 'abcd', 'efgh').token;
    v2adminQuizCreate(token1, 'Australian Tourist Attractions', 'lorem ipsum');
    v2adminQuizCreate(token1, 'Australian Beaches', 'lorem ipsum');
    const quizId1 = v2adminQuizCreate(token1, 'Australian Cities', 'lorem ipsum').quizId;
    v2adminQuizCreate(token1, 'Australian States', 'lorem ipsum');

    expect(adminQuizDescriptionUpdate(token1, quizId1, 'lorem ipsum decorum')).toStrictEqual({});
    expect(v2adminQuizInfo(token1, quizId1).description).toStrictEqual('lorem ipsum decorum');
  });

  test('Test Successful Quiz Description Update', () => {
    expect(adminQuizDescriptionUpdate(token, quizId, 'lorem ipsum decorum')).toStrictEqual({});
  });

  test('Test Unsuccessful: Token Invalid', () => {
    expect(() => adminQuizDescriptionUpdate('-1', quizId, 'lorem ipsum decorum')).toThrow(HTTPError[401]);// Since authId are positive, -1 is an obvious invalid id.
  });

  test('Test Unsuccessful: Quiz ID invalid', () => {
    expect(() => adminQuizDescriptionUpdate(token, 1234, 'lorem ipsum decorum')).toThrow(HTTPError[403]);// 1234 being an obvious not authorised quizId.
  });

  test('Test Unsuccessful: Desc Too Long', () => {
    expect(() => adminQuizDescriptionUpdate(token, quizId,
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem ')).toThrow(HTTPError[400]);
  });

  test('Test Unsuccessful: Quiz Is Not Owned By User', () => {
    const token1 = adminAuthRegister('abcd@gmail.com', 'abcd1234', 'abcd', 'efgh');
    const token2 = adminAuthRegister('qwert.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
    const quizId1 = v2adminQuizCreate(token1.token, 'Australian Cities', 'lorem ipsum');
    expect(() => adminQuizDescriptionUpdate(token2.token, quizId1.quizId,
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem ')).toThrow(HTTPError[403]);
  });
});
