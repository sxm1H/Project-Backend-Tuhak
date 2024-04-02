// import { clear, adminAuthRegister } from './testHelpers';

// beforeEach(() => {
//   clear();
// });

// describe('Testing DELETE /v1/clear', () => {
//   test('Successful login after clear of same id', () => {
//     expect(adminAuthRegister('nick@gmail.com', 'nick12345', 'Nicholas', 'Sebastian')).toStrictEqual(
//       {
//         statusCode: 200,
//         jsonBody: { authUserId: expect.any(Number) }
//       }
//     );

//     clear();

//     // Should expect id to be a number, since we made the same exact profile after clearing data.
//     expect(adminAuthRegister('nick@gmail.com', 'nick12345', 'Nicholas', 'Sebastian')).toStrictEqual(
//       {
//         statusCode: 200,
//         jsonBody: { authUserId: expect.any(Number) }
//       }
//     );
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
