import { json } from 'stream/consumers';
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
  adminQuizDescriptionUpdate,
  adminQuizQuestionCreate,
  adminQuizQuestionUpdate,
} from './testHelpers';

beforeEach(() => {
  clear();
});

describe('Testing POST /v1/admin/quiz/:quizid/question', () => {
  let token: string;
  let quizId: number;
  let questionId: number;
  beforeEach(() => {
      token = adminAuthRegister('abcd.efgh@gmail.com', 'abcd1234', 'abcd', 'efgh').jsonBody.token;
      quizId = adminQuizCreate(token, 'Australian Cities', 'lorem ipsum').jsonBody.quizId;
      questionId = adminQuizQuestionCreate(quizId, token,'What is the best city in Australia',4,5 ,[{answer: 'Sydney', correct: true}, {answer: 'Melbourne', correct: false}]).jsonBody.questionId;
  })

  test.each([
      ['lorem ipsum something something', 2, 1, [{answer: 'İzmir', correct: true}, {answer: 'İstanbul', correct: false}]],
      ['What is the best city in Turkey', 4, 5, [{answer: 'İzmir', correct: true}, {answer: 'İstanbul', correct: false}]],
  ])('Test Successful: Updating a Question with One or More Answers', (question, duration, points, answers) => {
    
      expect(adminQuizQuestionUpdate(question, duration, points, answers, token, quizId, questionId)).toStrictEqual({
        jsonBody: {},
        statusCode: 200,
      })
      const { statusCode, jsonBody } = adminQuizInfo(token, quizId);
      expect(statusCode).toStrictEqual(200);
      expect(jsonBody).toStrictEqual({
        quizId: quizId,
        name: expect.any(String),
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: expect.any(String),
        duration: duration,
        questions: [
            {
          questionId: questionId,
          question: question,
          duration: duration,
          points: points,
          answers: [
            {
                answer: 'İzmir',
                answerId: expect.any(Number),
                correct: true,
                //colour: expect.any(String)
            },
            {
                answer: 'İstanbul',
                answerId: expect.any(Number),
                correct: false,
                //colour: expect.any(String)
            },
          ],

          }
        ],
        numQuestions: expect.any(Number)
      }
      )
  })/*
  test.each([
    ['lorem ipsum something something', 2, 1, [{answer: 'İzmir', correct: true}, {answer: 'İstanbul', correct: false}]],
      ['What is the best city in Turkey', 4, 5, [{answer: 'İzmir', correct: true}, {answer: 'İstanbul', correct: false}]],
  ])('Test Succesful: Updating multiple questions with one or more answers', (question, duration, points, answers) => {
  
  let  questionId2 = adminQuizQuestionCreate(quizId, token,'What is the best city in Australia',4,5 ,[{answer: 'Sydney', correct: true}, {answer: 'Melbourne', correct: false}]).jsonBody.questionId;
  expect(adminQuizQuestionUpdate(question, duration, points, answers, token, quizId, questionId)).toStrictEqual({
    jsonBody: {},
    statusCode: 200,
  })
  const { statusCode, jsonBody } = adminQuizInfo(token, quizId);
      expect(statusCode).toStrictEqual(200);
      expect(jsonBody).toStrictEqual({
        quizId: quizId,
        name: expect.any(String),
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: expect.any(String),
        duration: duration + 4,//added 4 because the function adds the duration of the question created in the before each function aswell and the duration there is 4
        questions: [
            {
          questionId: questionId,
          question: question,
          duration: duration,
          points: points,
          answers: [
            {
                answer: 'İzmir',
                answerId: expect.any(Number), // here for some reason expect.any doesnt work and it returns an error for in the test for some reason ???
                correct: true,
                colour: expect.any(String)
            },
            {
                answer: 'İstanbul',
                answerId: expect.any(Number),
                correct: false,
                colour: expect.any(String)
            },
          ],

          },
          {
            questionId: questionId2,
            question: 'What is the best city in Australia',
            duration: 4,
            points: 5,
            answers: [{answer: 'Sydney', correct: true,answerId: expect.any(Number), colour: expect.any(String)}, {answer: 'Melbourne', correct: false}, ],
  
            }
        ],
        numQuestions: expect.any(Number)
       /* quizId: quizId,
        name: expect.any(String),
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: expect.any(String),
        duration: duration,
        questions: [
            {
             
              answers: answers,
              questionId: questionId,
              question: question,
              duration: duration,
              points: points,
          },
          {
            answers: answers,
            questionId: questionId,
            question: question,
            duration: duration,
            points: points,
        }
        ],
        numQuestions: expect.any(Number)
      }
    )*/
    /*expect(adminQuizQuestionUpdate(question, duration, points, answers, token, quizId, questionId2)).toStrictEqual({
      jsonBody: {},
      statusCode: 200,
    })
    const quizinfo2 = adminQuizInfo(token, quizId);
        expect(quizinfo2.statusCode).toStrictEqual(200);
        expect(quizinfo2.jsonBody).toStrictEqual({
          quizId: quizId,
          name: expect.any(String),
          timeCreated: expect.any(Number),
          timeLastEdited: expect.any(Number),
          description: expect.any(String),
          duration: duration,
          questions: [
              {
            questionId: questionId,
            question: question,
            duration: duration,
            points: points,
            answers: answers,
  
            }
          ],
          numQuestions: expect.any(Number)
        }
      )*/
    

  test.each([
      ['Q?', 4, 5, [{answer: 'Sydney', correct: true}, {answer: 'Melbourne', correct: false}]],
      ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 4, 5, [{answer: 'Sydney', correct: true}, {answer: 'Melbourne', correct: false}]],
  ])('Test Unsuccessful: Question length is not between 5 and 50 characters', (question, duration, points, answers)=> {
      expect(adminQuizQuestionUpdate(question, duration, points, answers, token, quizId, questionId)).toStrictEqual({
          jsonBody: { error: expect.any(String) },
          statusCode: 400,
      })
  })

  test.each([
      ['What is the best city in Australia', 4, 5, [
          {answer: 'Sydney', correct: true}, 
          {answer: 'Melbourne', correct: false},
          {answer: 'Parramatta', correct: false}, 
          {answer: 'Brisbane', correct: false},
          {answer: 'Perth', correct: false}, 
          {answer: 'Geelong', correct: false},
          {answer: 'Gold Coast', correct: false},
      ]],
      ['What is the best city in Australia', 4, 5, [{answer: 'Sydney', correct: true}]],
  ])('Test Unsuccessful: Number of Answers Not Between 2 and 6', (question, duration, points, answers)=> {
      expect(adminQuizQuestionUpdate(question, duration, points, answers, token, quizId, questionId)).toStrictEqual({
          jsonBody: {
              error: expect.any(String),
          },
          statusCode: 400,
      })
  })

  test('Test Unsuccessful: Question Duration Negative', () => {
      const question = 'What is the best city in Australia';
      const points = 1;
      const duration = -1;
      const answers = [{answer: 'Sydney', correct: true}, {answer: 'Melbourne', correct: false}]
      expect(adminQuizQuestionUpdate(question, duration, points, answers, token, quizId, questionId)).toStrictEqual({
          jsonBody: {
              error: expect.any(String),
          },
          statusCode: 400,
      })
  })

  test.each([
      ['What is the best city in Australia', 4, -1, [{answer: 'Sydney', correct: true}, {answer: 'Melbourne', correct: false}]],
      ['What is the best city in Australia', 4, 11, [{answer: 'Sydney', correct: true}, {answer: 'Melbourne', correct: false}]],
  ])('Test Unsuccessful: Points are not between 1 and 10', (question, duration, points, answers) => {
      expect(adminQuizQuestionUpdate(question, duration, points, answers, token, quizId, questionId)).toStrictEqual({
          jsonBody: {
              error: expect.any(String),
          },
          statusCode: 400,
      })
  })

  test.each([
      ['What is the best city in Australia', 4, 1, [{answer: '', correct: true}, {answer: 'Melbourne', correct: false}]],
      ['What is the best city in Australia', 4, 1, [{answer: 'Sydney', correct: true}, {answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', correct: false}]],
  ])('Test Unsuccessful: Length of answer is not between 1 and 30', (question, duration, points, answers) => {
      expect(adminQuizQuestionUpdate(question, duration, points, answers, token, quizId, questionId)).toStrictEqual({
          jsonBody: {
              error: expect.any(String),
          },
          statusCode: 400,
      })
  })

  test('Test Unsuccessful: Answer Options Are the Same', () => {
      const question = 'What is the best city in Australia';
      const duration = 5;
      const points = 1;
      const answers = [{answer: 'Sydney', correct: true}, {answer: 'Sydney', correct: false}]
      expect(adminQuizQuestionUpdate(question, duration, points, answers, token, quizId, questionId)).toStrictEqual({
          jsonBody: {
              error: expect.any(String),
          },
          statusCode: 400,
      })
  })

  test('Test Unsuccessful: No Correct Options', () => {
      const question = 'What is the best city in Australia';
      const duration = 5;
      const points = 1;
      const answers = [{answer: 'Sydney', correct: false}, {answer: 'Sydney', correct: true}]
      expect(adminQuizQuestionUpdate(question, duration, points, answers, token, quizId, questionId)).toStrictEqual({
          jsonBody: {
              error: expect.any(String),
          },
          statusCode: 400,
      })
  })

  test('Test Unsuccessful: Quiz Duration Exceed 3 Minutes.', () => {
      let answers = [{answer: 'Sydney', correct: false}, {answer: 'Melbourne', correct: true}];
      
      expect(adminQuizQuestionUpdate('Question1', 100, 1, answers, token, quizId, questionId)).toStrictEqual({
          jsonBody: {},
          statusCode: 200,
      })

      answers = [{answer: 'Cricket', correct: false}, {answer: 'Football', correct: true}];
      expect(adminQuizQuestionUpdate('Question1', 81, 2, answers, token, quizId, questionId)).toStrictEqual({
          jsonBody: {
              error: expect.any(String),
          },
          statusCode: 400,
      })
  })

  test('Test Unsuccessful: User Does Not Own This Quiz', () => {
      const sessionId2 = adminAuthRegister('glhf@gmail.com', 'glhf1234', 'abcd', 'efgh').jsonBody; 

      const question = 'What is the best city in Australia';
      const duration = 5;
      const points = 1;
      const answers = [{answer: 'Sydney', correct: false}, {answer: 'Sydney', correct: true}]
     
      expect( adminQuizQuestionUpdate(question, duration, points, answers, sessionId2.token, quizId, questionId)).toStrictEqual({
          jsonBody: {
              error: expect.any(String),
          },
          statusCode: 403,
      })
  })

  test('Test Unsuccessful: No Correct Options', () => {
      const question = 'What is the best city in Australia';
      const duration = 5;
      const points = 1;
      const answers = [{answer: 'Sydney', correct: false}, {answer: 'Sydney', correct: true}]
      expect(adminQuizQuestionUpdate(question, duration, points, answers, token, quizId, questionId)).toStrictEqual({
          jsonBody: {
              error: expect.any(String),
          },
          statusCode: 400,
      })
  })

  test.each([
      ['','What is the best city in Australia', 4, 1, [{answer: 'Sydney', correct: true}, {answer: 'Melbourne', correct: false}]],
      ['000000','What is the best city in Australia', 4, 1, [{answer: 'Sydney', correct: true}, {answer: 'Melbourne', correct: false}]],
  ])('Test Unsuccessful: Invalid Tokens', (tokenTemp, question, duration, points, answers) => {
      expect(adminQuizQuestionUpdate(question, duration, points, answers, tokenTemp, quizId, questionId)).toStrictEqual({
          jsonBody: {
              error: expect.any(String),
          },
          statusCode: 401,
      })
  })
})