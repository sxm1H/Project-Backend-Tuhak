// import {
//   clear,
//   adminAuthRegister,
//   adminQuizCreate,
// } from './testHelpers';

// beforeEach(() => {
//   clear();
// });

// describe ('Testing POST /v1/admin/quiz', () => {

//   test('User Id was not valid', () => {
//     const {statusCode, jsonBody } = adminQuizCreate(-1, 'amazing Quiz', 'the quiz Id is not a number');
//     expect(statusCode).toStrictEqual(400);
//     expect(jsonBody).toStrictEqual({
//       error: expect.any(String)
//     });
//   });
	
//   test.each([
//     {
//       name: '$:^)$',
//       description: 'Quiz smile'
//     },
//     {
//       name: '(^___^)@b',
//       description: 'Quiz Thumbsup'
//     },
//     {
//       name: '%%%%%%%%%',
//       description: 'percentage Quiz'
//     }
//   ])('Quiz name has invalid characters', ({name, description}) => {
//     const {jsonBody: {authUserId} } = adminAuthRegister('somethin@gmail.com', 'validpassword123', 'Franz', 'Kafka');
//     const {statusCode, jsonBody} = adminQuizCreate(authUserId, name, description);
//     expect(statusCode).toStrictEqual(400);
//     expect(jsonBody).toStrictEqual({
//       error: expect.any(String)
//     });
//   });
	
//   test.each([
//     {
//       name: 'AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH',
//       description: 'Loud screaming is too long'
//     },
//     {
//       name: 'um',
//       description: 'Quiz is unsure'
//     },
//     {
//       name: ' ',
//       description: 'Blank quiz'
//     }
//   ]) ('Check Quiz name is between valid character limit', ({name, description}) => {
//     const {jsonBody: {authUserId}} = adminAuthRegister('another@gmail.com', 'validpassword12367', 'Ludwig', 'Beethoven');
//     const {statusCode, jsonBody} = adminQuizCreate(authUserId, name, description)
//     expect(statusCode).toStrictEqual(400);
//     expect(jsonBody).toStrictEqual({
//       error: expect.any(String)
//     });
//   });
	
//   test('Check if Quiz Name already exists', () => {
//     const{jsonBody: {authUserId}} = adminAuthRegister('cool@gmail.com', 'Thebestpassword123', 'Isaac', 'Newton');
//     adminQuizCreate(authUserId, 'Cool Quiz', 'The best quiz in the world');
//     const{statusCode, jsonBody } = adminQuizCreate(authUserId, 'Cool Quiz', 'Another cool quiz');
//     expect(statusCode).toStrictEqual(400);
//     expect(jsonBody).toStrictEqual({
//       error: expect.any(String)
//     })
//   });
	
//   test('Quiz Description is too long', () => {
//     const {jsonBody: {authUserId}}= adminAuthRegister('Fake@gmail.com', 'passwordpassword123', 'first', 'last');
//     const {statusCode, jsonBody} = adminQuizCreate(authUserId, 'Too Long','Lorem ipsum dolor sit amet. Eos deleniti inventore est illo eligendi ut excepturi molestiae aut vero quas. Et dolorum doloremque ad reprehenderit adipisci qui voluptatem harum');
//     expect(statusCode).toStrictEqual(400);
//     expect(jsonBody).toStrictEqual({
//       error: expect.any(String)
//     });
//   });
	
//   test.each([
//     {
//       name: 'good name',
//       description: 'Loud screaming is too long'
//     },
//     {
//       name: 'blank quiz',
//       description: ''
//     }
//   ])('Successful Quiz Created', ({name, description}) => {
//     const {jsonBody: {authUserId}} = adminAuthRegister('fakerT1@gmail.com', 'pass123word', 'Smith', 'John');
//     const {statusCode, jsonBody} = adminQuizCreate(authUserId, name, description);
    
//     expect(statusCode).toStrictEqual(200);
//     expect(jsonBody).toStrictEqual({
//       quizId: expect.any(Number)
//     });
//   });    
// });

// DELETE EVERYTHING UNDER THIS
import { clear, adminAuthRegister } from './testHelpers';
test('Temporary', () => {
  clear();
  expect(adminAuthRegister('dunyao@unsw.edu.au', 'abcd1234', 'DunYao', 'Foo')).toStrictEqual(
    {
      statusCode: 200,
      jsonBody: { token: expect.any(String) }
    }
  );
});