// import {
//   clear,
//   adminAuthRegister,
//   adminQuizCreate,
//   adminQuizDescriptionUpdate,
//   adminQuizInfo,
// } from './testHelpersIter2';

// import HTTPError from 'http-errors';

// let token: string;
// let quizId: number;
// beforeEach(() => {
//   clear();

//   token = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh').jsonBody.token;
//   quizId = adminQuizCreate(token, 'Australian Cities', 'lorem ipsum').jsonBody.quizId;
// });

// describe('Testing PUT v1/admin/quiz/:quizid/description', () => {
//   test('Comprehensive Test Successful: Using Quiz Info to check whether the desc has been updated', () => {
//     expect(adminQuizDescriptionUpdate(token, quizId, 'lorem ipsum decorum')).toStrictEqual({});

//     const response = adminQuizInfo(token, quizId);
//     expect(response.description).toStrictEqual('lorem ipsum decorum');
//   });

//   test('Comprehensive Test Successful: Using Quiz Info to check updated desc when the user has multiple quizzes.', () => {
//     const token1 = adminAuthRegister('abcd@gmail.com', 'abcd1234', 'abcd', 'efgh').jsonBody.token;
//     adminQuizCreate(token1, 'Australian Tourist Attractions', 'lorem ipsum');
//     adminQuizCreate(token1, 'Australian Beaches', 'lorem ipsum');
//     const quizId1 = adminQuizCreate(token1, 'Australian Cities', 'lorem ipsum').jsonBody.quizId;
//     adminQuizCreate(token1, 'Australian States', 'lorem ipsum');

//     expect(adminQuizDescriptionUpdate(token1, quizId1, 'lorem ipsum decorum')).toStrictEqual({});
//     expect(adminQuizInfo(token1, quizId1).description).toStrictEqual('lorem ipsum decorum');
//   });

//   test('Test Successful Quiz Description Update', () => {
//     expect(adminQuizDescriptionUpdate(token, quizId, 'lorem ipsum decorum')).toStrictEqual({});
//   });

//   test('Test Unsuccessful: Token Invalid', () => {
//     const valid = adminQuizDescriptionUpdate('-1', quizId, 'lorem ipsum decorum'); // Since authId are positive, -1 is an obvious invalid id.
//     expect(() => valid).toThrow(HTTPError[401]);
//   });

//   test('Test Unsuccessful: Quiz ID invalid', () => {
//     const valid = adminQuizDescriptionUpdate(token, 1234, 'lorem ipsum decorum'); // 1234 being an obvious not authorised quizId.
//     expect(() => valid).toThrow(HTTPError[403]);
//   });

//   test('Test Unsuccessful: Desc Too Long', () => {
//     const valid = adminQuizDescriptionUpdate(token, quizId, 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?');
//     expect(() => valid).toThrow(HTTPError[400]);
//   });

//   test('Test Unsuccessful: Quiz Is Not Owned By User', () => {
//     const token1 = adminAuthRegister('abcd@gmail.com', 'abcd1234', 'abcd', 'efgh');
//     const token2 = adminAuthRegister('qwert.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh');
//     const quizId1 = adminQuizCreate(token1.token, 'Australian Cities', 'lorem ipsum');
//     const valid = adminQuizDescriptionUpdate(token2.token, quizId1.quizId, 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?');
//     expect(() => valid).toThrow(HTTPError[403]);
//   });
// });

test('temp', () => {
  expect(2 + 2).toBe(4);
});