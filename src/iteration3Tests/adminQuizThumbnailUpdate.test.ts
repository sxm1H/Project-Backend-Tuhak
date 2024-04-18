import { v2adminQuizCreate, adminQuizThumbnailUpdate } from './v2testHelpers';
import {
  clear,
  adminAuthRegister
} from '../iteration2Tests/testHelpers';
import HTTPError from 'http-errors';

const thumbnailUrl = 'https://s3-eu-west-1.amazonaws.com/blog-ecotree/blog/0001/01/ad46dbb447cd0e9a6aeecd64cc2bd332b0cbcb79.jpeg';
let token: string;
let quizId: number;
beforeEach(() => {
  clear();

  token = adminAuthRegister('nick1234@gmail.com', 'nick1234', 'Nicholas', 'Sebastian').token;
  quizId = v2adminQuizCreate(token, 'QuizName', 'QuizDescription').quizId;
});

describe('Test PUT /v1/admin/quiz/{quizid}/thumbnail', () => {
  test('Valid img update', () => {
    expect(adminQuizThumbnailUpdate(quizId, token, thumbnailUrl)).toStrictEqual({});
  });

  test('Token invalid', () => {
    expect(() => adminQuizThumbnailUpdate(quizId, token + 1, thumbnailUrl)).toThrow(HTTPError[401]);
  });

  test.each([
    {
      imgUrl: 'https://www.greenlawnfertilizing.com/hs-fs/hubfs/Imported_Blog_Media/oak-tree-540x540_jpg-Dec-06-2023-05-34-04-6440-PM.webp?width=540&height=540&name=oak-tree-540x540_jpg-Dec-06-2023-05-34-04-6440-PM.webp'
    },
    {
      imgUrl: 'coolimage.png'
    },
    {
      imgUrl: 'https://cool.com'
    }
  ])('Image url is not valid', ({ imgUrl }) => {
    expect(() => adminQuizThumbnailUpdate(quizId, token, imgUrl)).toThrow(HTTPError[400]);
  });

  test('Quiz Id does not exist', () => {
    expect(() => adminQuizThumbnailUpdate(quizId + 1, token, thumbnailUrl)).toThrow(HTTPError[403]);
  });

  test('User does not own quiz', () => {
    const newToken = adminAuthRegister('pog@gmail.com', 'pogggg1234', 'pog', 'pog').token;
    expect(() => adminQuizThumbnailUpdate(quizId, newToken, thumbnailUrl)).toThrow(HTTPError[403]);
  });
});
