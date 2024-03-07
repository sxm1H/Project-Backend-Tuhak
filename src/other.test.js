import { clear } from './other.js'
import { adminAuthRegister } from './auth.js'

beforeEach(() => {
  clear();
})

describe('Tests for clear', () => {

    test('Successful login after clear of same id', () => {
      let academic = adminAuthRegister("nick@gmail.com", "nick12345", 'Nicholas', 'Sebastian');
      
      expect(academic.authUserId).toEqual(expect.any(Number));

      clear();
      academic = adminAuthRegister("nick@gmail.com", "nick12345", 'Nicholas', 'Sebastian');

      // Should expect id to be a number, since we made the same exact profile after clearing data.
      expect(academic.authUserId).toEqual(expect.any(Number));
    });
  
  });