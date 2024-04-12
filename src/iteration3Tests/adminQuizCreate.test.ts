import {
  clear,
  adminAuthRegister,
  adminQuizCreate,
} from './testHelpersIter3';

let token: string;
beforeEach(() => {
  clear();

  token = adminAuthRegister('somethin@gmail.com', 'validpassword123', 'Franz', 'Kafka').jsonBody.token;
});

describe('Testing POST /v1/admin/quiz', () => {
  test('Token was not valid', () => {
    const { statusCode, jsonBody } = adminQuizCreate(token + '1', 'amazing Quiz', 'the quiz Id is not a number');
    expect(statusCode).toStrictEqual(401);
    expect(jsonBody).toStrictEqual({
      error: expect.any(String)
    });
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
    const { statusCode, jsonBody } = adminQuizCreate(token, name, description);
    expect(statusCode).toStrictEqual(400);
    expect(jsonBody.error).toStrictEqual(expect.any(String));
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
    const { statusCode, jsonBody } = adminQuizCreate(token, name, description);
    expect(statusCode).toStrictEqual(400);
    expect(jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Check if Quiz Name already exists', () => {
    adminQuizCreate(token, 'Cool Quiz', 'The best quiz in the world');
    const { statusCode, jsonBody } = adminQuizCreate(token, 'Cool Quiz', 'Another cool quiz');
    expect(statusCode).toStrictEqual(400);
    expect(jsonBody.error).toStrictEqual(expect.any(String));
  });

  test('Quiz Description is too long', () => {
    const { statusCode, jsonBody } = adminQuizCreate(token, 'Too Long', 'Lorem ipsum dolor sit amet. Eos deleniti inventore est illo eligendi ut excepturi molestiae aut vero quas. Et dolorum doloremque ad reprehenderit adipisci qui voluptatem harum');
    expect(statusCode).toStrictEqual(400);
    expect(jsonBody.error).toStrictEqual(expect.any(String));
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
    const { statusCode, jsonBody } = adminQuizCreate(token, name, description);
    expect(statusCode).toStrictEqual(200);
    expect(jsonBody.quizId).toStrictEqual(expect.any(Number));
  });
});
