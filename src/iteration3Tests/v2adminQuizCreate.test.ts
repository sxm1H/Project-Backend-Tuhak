import {
  clear,
  adminAuthRegister
} from '../iteration2Tests/testHelpers';
import { v2adminQuizCreate } from './v2testHelpers';
import HTTPError from 'http-errors';

let token: string;
beforeEach(() => {
  clear();

  token = adminAuthRegister('somethin@gmail.com', 'validpassword123', 'Franz', 'Kafka').token;
});

describe('Testing POST /v1/admin/quiz', () => {
  test('Token was not valid', () => {
    expect(() => v2adminQuizCreate(token + '1', 'amazing Quiz', 'the quiz Id is not a number')).toThrow(HTTPError[401]);
  });

  test.each([
    {
      name: '$:^)$',
      description: 'Quiz smile'
    },
    {
      name: '(^___^)@b',
      description: 'Quiz Thumbsup'
    },
    {
      name: '%%%%%%%%%',
      description: 'percentage Quiz'
    }
  ])('Quiz name has invalid characters', ({ name, description }) => {
    expect(() => v2adminQuizCreate(token, name, description)).toThrow(HTTPError[400]);
  });

  test.each([
    {
      name: 'AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH',
      description: 'Loud screaming is too long'
    },
    {
      name: 'um',
      description: 'Quiz is unsure'
    },
    {
      name: ' ',
      description: 'Blank quiz'
    }
  ])('Check Quiz name is between valid character limit', ({ name, description }) => {
    expect(() => v2adminQuizCreate(token, name, description)).toThrow(HTTPError[400]);
  });

  test('Check if Quiz Name already exists', () => {
    v2adminQuizCreate(token, 'Cool Quiz', 'The best quiz in the world');
    expect(() => v2adminQuizCreate(token, 'Cool Quiz', 'The best quiz in the world')).toThrow(HTTPError[400]);
  });

  test('Quiz Description is too long', () => {
    expect(() => v2adminQuizCreate(token, 'Too Long',
      'Lorem ipsum dolor sit amet. Eos deleniti inventore est illo eligendi ut excepturi molestiae aut vero quas. Et dolorum doloremque ad reprehenderit adipisci qui voluptatem harum'))
      .toThrow(HTTPError[400]);
  });

  test.each([
    {
      name: 'good name',
      description: 'Loud screaming is too long'
    },
    {
      name: 'blank quiz',
      description: ''
    }
  ])('Successful Quiz Created', ({ name, description }) => {
    expect(v2adminQuizCreate(token, name, description)).toStrictEqual({
      quizId: expect.any(Number)
    });
  });
});
