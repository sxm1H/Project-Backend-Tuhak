import {
  getData,
  setData,
} from './dataStore';
import {
  ErrorObject,
  States,
  Actions,
  quizState,
  Player,
  QuizId,
  Question,
  QuizInfoReturn,
  QuestionResultsReturn,
  PlayerId,
  ChatReturn,
  SessionIdReturn,
  QuizSessionReturn,
  SessionStatusReturn,
  FinalScoreReturn,
  QuizPlayerReturn,
  QuestionId
} from './interfaces';
import HTTPError from 'http-errors';
import { port, url } from './config.json';

const DEPLOYED_URL = 'https://1531-24t1-f13b-dream.vercel.app';
const fs = require('fs');
interface timeoutobj {
  sessionId: number;
  timeoutId: ReturnType<typeof setTimeout>;
}
const timeoutIds: timeoutobj[] = [];

/**
 * adminQuizThumbnailUpdate will update the thumbnail URL to a Quiz to a URL of there choice. It will update
 * the last time the quiz was edited. It should throw errors when
 *  - Token is invalid (User is not logged in)
 *  - The User does not own the quiz being edited
 *  - The ThumbnailUrl the user wants to update is not a valid link to an image
 *
 * @param {string} token - Token of the user updating the quiz
 * @param {number} quizId - The Quiz the user wants to update
 * @param {string} imgUrl - The url of the image of that the user wants to update to
 *
 * @return {object {}} - return an empty object when successful
 */
function adminQuizThumbnailUpdate(quizId: number, token: string, imgUrl: string): ErrorObject | Record<string, never> {
  const data = getData();

  const findToken = data.sessions.find(ids => ids.token === token);
  const findQuiz = data.quizzes.find(quiz => quiz.quizId === quizId);

  if (!findToken) {
    throw HTTPError(401, 'Token is empty or invalid :(');
  }
  if (!findQuiz) {
    throw HTTPError(403, 'Quiz Id is invalid.');
  }
  if (findQuiz.authUserId !== findToken.userId) {
    throw HTTPError(403, 'User does not own this quiz.');
  }

  if (!isValidThumbnailUrlEnding(imgUrl) || !isValidThumbnailUrlStarting(imgUrl)) {
    throw HTTPError(400, 'Invalid image url');
  }

  findQuiz.thumbnailUrl = imgUrl;
  findQuiz.timeLastEdited = Math.floor(Date.now() / 1000);

  setData(data);
  return {};
}

/**
 * adminQuizSessionCreate will Create a new session for the given quizId.
 * This session will start at LOBBY state and will stay there until the corresponding
 * number of players join the session. The function should check if:
 *   - The token is valid
 *   - The Quiz exists/is valid
 *   - The user owns the quiz
 *   - If the autoStartNum is greater than 50
 *   - There are more than 10 active sessions for the quiz
 *   - The Quiz does not have any questions in it
 *   - THe quiz is in the trash
 *
 * @param {string} token - token of the user creating the session
 * @param {number} quizId - the quiz that the session is being created from
 * @param {number} autoStartNum - the number of players that have to join to automatically start the quiz
 * @returns {{object {sessionId: number}}} - Returns a unique Id of the session being created
 */
function adminQuizSessionCreate(token: string, quizId: number, autoStartNum: number): ErrorObject | SessionIdReturn {
  const data = getData();
  const findToken = data.sessions.find(ids => ids.token === token);
  const findQuiz = data.quizzes.find(quiz => quiz.quizId === quizId);

  if (!findToken) {
    throw HTTPError(401, 'Token is empty or invalid');
  } else if (!findQuiz) {
    throw HTTPError(403, 'Quiz Id is invalid.');
  }

  if (findToken.userId !== findQuiz.authUserId) {
    throw HTTPError(403, 'User does not own this Quiz');
  }

  if (autoStartNum > 50) {
    throw HTTPError(401, 'autoStartNum is a number greater than 50');
  }

  let endStateCounter = 0;
  for (const sessions of data.quizActiveState) {
    if (quizId === sessions.metadata.quizId) {
      if (sessions.state === States.END) {
        endStateCounter++;
      }
    }
  }

  if (endStateCounter === 10) {
    throw HTTPError(400, '10 sessions that are not in END state currently exist for this quiz');
  }

  if (findQuiz.numQuestions === 0) {
    throw HTTPError(400, 'The quiz does not have any questions in it');
  }

  const findQuizInTrash = data.trash.find(quiz => quiz.quizId === quizId);

  if (findQuizInTrash) {
    throw HTTPError(400, 'The quiz is in trash');
  }

  const newSessionId = Math.floor((Math.random() * 1000000 + 1));

  data.quizActiveState.push({
    metadata: { ...findQuiz },
    sessionId: newSessionId, // NEEDS TO BE UPDATED LATER TO BE CHECKED UNIQUELY
    state: States.LOBBY,
    atQuestion: 0,
    players: [],
    autoStartNum: autoStartNum,
    messages: [],
  });

  setData(data);
  return { sessionId: newSessionId };
}
/**
 * adminQuizSessionUpdate will update the session's state based on the current state of the session
 * and the action provided. When the session switches from QUESTION_OPEN state to another state, all players
 * last submitted answers will be calculated.
 * This function will check if:
 *  - The token is valid and owns the quiz
 *  - The user owns this quiz
 *  - The SessionId is a valid session
 *  - The Aciton is a valid action that can be taken
 *  - The action being taken is a valid action for the current state
 * @param { string } token
 * @param { number } quizId
 * @param { number } sessionId
 * @param { string } action
 *
 * @returns {object {}} - it will return an object if successful
 */
function adminQuizSessionUpdate(token: string, quizId: number, sessionId: number, action: string): ErrorObject | Record<string, never> {
  const data = getData();
  const findToken = data.sessions.find(ids => ids.token === token);
  const findQuiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  const findSession = data.quizActiveState.find(session => session.sessionId === sessionId);

  if (!findToken) {
    throw HTTPError(401, 'Token is empty or invalid');
  } else if (!findQuiz) {
    throw HTTPError(403, 'Quiz Id is invalid.');
  }

  if (findToken.userId !== findQuiz.authUserId) {
    throw HTTPError(403, 'User does not own this Quiz');
  }

  if (!findSession) {
    throw HTTPError(400, 'SessionId is invalid');
  }

  if (!(action in Actions)) {
    throw HTTPError(400, 'Action provided is not a valid Action enum');
  }

  // Made it so it returns in each if control structure, so they don't overlap
  // I could've made it all in one control structure, however, that would be ugly

  if (findSession.state === States.LOBBY) {
    if (action === Actions.NEXT_QUESTION) {
      findSession.state = States.QUESTION_COUNTDOWN;
      const timeoutId = setTimeout(quizWaitThreeHelper, 3 * 1000, findSession);
      timeoutIds.push({
        sessionId: sessionId,
        timeoutId: timeoutId
      });
    } else if (action === Actions.END) {
      findSession.state = States.END;
    } else {
      throw HTTPError(400, 'Action enum cannot be applied in the current state');
    }

    setData(data);
    return {};
  }

  // If state == END could be a possible outcome.
  if (findSession.state === States.END) {
    throw HTTPError(400, 'Action enum cannot be applied in the current state');
  } else if (findSession.state === States.QUESTION_COUNTDOWN) {
    quizCountdownHelper(findSession, action);
  } else if (findSession.state === States.QUESTION_OPEN) {
    quizOpenHelper(findSession, action);
  } else if (findSession.state === States.QUESTION_CLOSE) {
    quizCloseHelper(findSession, action);
  } else if (findSession.state === States.ANSWER_SHOW) {
    quizShowHelper(findSession, action);
  } else if (findSession.state === States.FINAL_RESULTS) {
    quizFinalHelper(findSession, action);
  }

  setData(data);
  return {};
}
/**
 * adminQuizSessionJoin will allow a guest player to be created and join an active
 * session. Each player will be assigned a unique player id. The function should test for
 *  - If the session is valid and in LOBBY State
 *  - If the player that joins does not have a unique name
 *
 *
 * @param { number } sessionId
 * @param {string} name
 * @returns {object {playerId: number}}
 */
function adminQuizSessionJoin(sessionId: number, name: string): ErrorObject | PlayerId {
  const data = getData();
  const findSession = data.quizActiveState.find(session => session.sessionId === sessionId);

  if (!findSession) {
    throw HTTPError(400, 'SessionId is invalid');
  }
  if (findSession.state !== States.LOBBY) {
    throw HTTPError(400, 'Session not in lobby state');
  }

  for (const players of findSession.players) {
    if (players.name === name) {
      throw HTTPError(400, 'Name of user entered is not unique in the lobby');
    }
  }

  // Edge case where the name could be somehow in the library, but uhh, doubt it.
  if (name === '') {
    name = generateRandomName();
  }

  const playerId = Math.floor((Math.random() * 1000000 + 1));

  findSession.players.push({
    name: name,
    playerId: playerId,
    questions: [],
    rank: [],
    scorePer: [],
    score: 0
  });

  setData(data);
  return { playerId: playerId };
}

/**
 * adminQuizPlayerSubmitAnswer will allow a player to submit an answer to the current question in the session.
 * The player is allowed to submit as many answers they can as long as the session is QUESTION_OPEN state. Only their
 * last answer they submitted will be considered when the question closes.
 * The function should check if:
 *  - The playerId exists in the current session
 *  - The session Is in QUESTION_OPEN state
 *  - The questionposition corresponds to a position outside the number of questions in the quiz
 *  - The quiz is up to the questionPosition
 *  - An answer is not submitted
 *  - The answers submitted do not correspond to the answers in the current question
 *
 * @param {number[]} answerIds - the array of answer selections a player has chosen
 * @param {number} playerid - the player Id of the player answering the question
 * @param questionposition - the question the player is answering
 *
 * @returns {object {}} - will return an empty object when successful
 */
function adminQuizPlayerSubmitAnswer (answerIds: number[], playerid: number, questionposition: number): ErrorObject | Record<string, never> {
  const data = getData();

  // Double for loop, to iterate through two arrays.

  // session thingo might not work

  let session: quizState | undefined;
  let findPlayer: Player;
  for (const sessions of data.quizActiveState) {
    for (const players of sessions.players) {
      if (players.playerId === playerid) {
        findPlayer = players;
        session = sessions;
      }
    }
  }

  if (session === undefined) {
    throw HTTPError(400, 'player ID does not exist');
  }

  if (session.state !== States.QUESTION_OPEN) {
    throw HTTPError(400, 'Session is not in QUESTION_OPEN state');
  }

  if (questionposition > session.metadata.numQuestions) {
    throw HTTPError(400, 'question position is not valid for the session this player is in');
  }

  if (questionposition !== session.atQuestion) {
    throw HTTPError(400, 'session is not yet up to this question');
  }

  if (answerIds.length < 1) {
    throw HTTPError(400, 'Less than 1 answer ID was submitted');
  }

  const possibleAnswers = session.metadata.questions[session.atQuestion - 1].answers;

  let actualAnswerCounter = 0;
  for (const actualAnswers of possibleAnswers) {
    if (actualAnswers.correct === true) {
      actualAnswerCounter++;
    }
  }

  let counter = 0;
  for (const answer of answerIds) {
    const findAnswer = possibleAnswers.find(answers => answers.answerId === answer);
    if (!findAnswer) {
      throw HTTPError(400, 'Answer IDs are not valid for this particular question');
    }
    if (findAnswer.correct === true) {
      counter++;
    }
  }

  const findQuestion = findPlayer.questions[questionposition - 1];
  if (counter === actualAnswerCounter) {
    findQuestion.isCorrect = true;
  }

  const timeEnd = Math.floor(Date.now() / 1000);

  findQuestion.timeEnd = timeEnd;
  findQuestion.timeTaken = timeEnd - findQuestion.timeStart;
  findQuestion.answers = answerIds;

  setData(data);
  return {};
}

/**
 * v2adminQuizCreate will create a new quiz and push all of its information (quizId, name, description,
 * user Id, time create, last time edited and thumbnailUrl) into dataStore it will return a unique quizId.
 *
 * @param {Int} authUserId - user id for the person creating the quiz
 * @param {string} name - The name of the quiz that is being created
 * @param {string} description - the description of the quiz being created
 *
 * @return {object {quizId: number}} - returns a quiz Id object that contains the unique quiz Id relating
 * to the created quiz.
 */
function v2adminQuizCreate(token: string, name: string, description: string): ErrorObject | QuizId {
  const newdata = getData();
  const activeTokens = newdata.sessions;
  const searchToken = activeTokens.findIndex(session => session.token === token);
  const isAlphanumeric = /^[a-zA-Z0-9 ]+$/.test(name);
  const date = Math.floor(Date.now() / 1000);

  if (searchToken === -1) {
    throw HTTPError(401, 'Token is empty or invalid');
  }

  if (!isAlphanumeric) {
    throw HTTPError(400, 'Quiz Name contains invalid characters');
  }

  if (name.length < 3 || name.length > 30) {
    throw HTTPError(400, 'Quiz Name must be more than 2 characters and less than 31 characters long');
  }

  const courseData = newdata.quizzes;
  const authUserId = activeTokens[searchToken].userId;

  for (const i of courseData) {
    if (i.authUserId === authUserId) {
      if (i.name === name) {
        throw HTTPError(400, 'Quiz name already in use');
      }
    }
  }

  if (description.length > 100) {
    throw HTTPError(400, 'Description is more than 100 characters');
  }

  newdata.quizIdCounter++;
  newdata.quizzes.push({
    quizId: newdata.quizIdCounter,
    name: name,
    description: description,
    authUserId: authUserId,
    timeCreated: date,
    timeLastEdited: date,
    numQuestions: 0,
    questions: [],
    duration: 0,
    thumbnailUrl: 'https://www.unsw.edu.au/content/dam/images/photos/events/open-day/2020-12-homepage-update/OpenDay_2019_campaign%20-0307-crop.cropimg.width=1920.crop=square.jpg'
  });

  setData(newdata);
  return { quizId: newdata.quizIdCounter };
}
/**
  * <Given a registered userId and quizId, delete the quiz from data storage.>
  * <In addition, the quiz will be sent to the trash in data, which can be retrieved
  * or permanantly deleted from data in the future"
  *
  * It should check for if :
  *    - the Token is valid/User is logged in
  *    - the quizId does not refer to a quiz that the user owns
  *    - Quiz Id does not refer to a quiz
  *    - There is a session of a quiz that is not in END state
  *
  * @param {Number} token - the token created in adminAuthRegister.
  * @param {number} quizId - quizId which may or may not be registered in the data
  *
  * @returns {object { }} returns empty object if function went successful
*/
function v2adminQuizRemove(token: string, quizId: number): ErrorObject | Record<string, never> {
  const newdata = getData();

  const findToken = newdata.sessions.find(session => session.token === token);
  const findQuizIndex = newdata.quizzes.findIndex(quiz => quiz.quizId === quizId);

  if (!findToken) {
    throw HTTPError(401, 'Does not refer to valid logged in user session');
  } else if (findQuizIndex === -1) {
    throw HTTPError(403, 'Quiz ID does not refer to a valid quiz');
  } else if (newdata.quizzes[findQuizIndex].authUserId !== findToken.userId) {
    throw HTTPError(403, 'User does not own this quiz.');
  }

  for (const activeSessions of newdata.quizActiveState) {
    if (activeSessions.metadata.quizId === quizId) {
      if (activeSessions.state !== States.END) {
        throw HTTPError(400, 'Any session for this quiz is not in END state');
      }
    }
  }

  newdata.quizzes[findQuizIndex].timeLastEdited = Math.floor(Date.now() / 1000);
  newdata.trash.push(newdata.quizzes[findQuizIndex]);
  newdata.quizzes.splice(findQuizIndex, 1);

  setData(newdata);
  return {};
}

/**
  * adminQuizTransfer takes in the user's token, the quizId of the quiz they wish to transfer ownership of, and
  * the email of the target user. If successful, the logged in user will no longer own the quiz, replaced by
  * the user linked to the email.
  *
  * This function does some preliminary error checking for
  *   1. Is the token valid
  *   2. Is the email valid
  *   3. Does the email belong to the logged in user
  *   4. Does the user actually own the quiz
  *   5. Does the target user own a quiz of the same name.
  *   6. Any session for the quiz is not in END state
  *
  * @param {string} token - This is the user's token for their session.
  * @param {string} userEmail - Email belonging to the target user.
  * @param {number} quizId - ID belonging to the quiz the logged in user wishes to transfer ownership of.
  *
  * @returns {object {}} Empty Object to indicidate that everything worked.
*/
function v2adminQuizTransfer(token: string, userEmail: string, quizId: number): ErrorObject | Record<string, never> {
  const data = getData();

  // Returns session object corresponding the given token.
  const findToken = data.sessions.find(session => session.token === token);
  // Early error check as findToken is used later.
  if (!findToken) {
    throw HTTPError(401, 'Token is empty or invalid');
  }

  for (const activeSessions of data.quizActiveState) {
    if (activeSessions.metadata.quizId === quizId) {
      if (activeSessions.state === States.END) {
        throw HTTPError(400, 'Any session for this quiz is not in END state');
      }
    }
  }

  // Returns quiz object corresponding with given quizId.
  const findQuiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  // Returns target user object corresponding to given userEmail.
  const findTarget = data.user.find(user => user.email === userEmail);
  // Returns user object corresponding with current logged in user.
  const findUser = data.user.find(user => user.userId === findToken.userId);

  // Error checks userEmail and permissions.
  if (!findQuiz) {
    throw HTTPError(403, 'Quiz Id is invalid.');
  } else if (!findTarget) {
    throw HTTPError(400, 'userEmail does not belong to any users.');
  } else if (findUser.email === userEmail) {
    throw HTTPError(400, 'userEmail belongs to the current logged user.');
  } else if (findQuiz.authUserId !== findToken.userId) {
    throw HTTPError(403, 'User does not own this quiz.');
  }

  // Check if the user with userEmail owns any quizzes with the same name as the quiz corresponding with quizId
  for (const quiz of data.quizzes) {
    if (quiz.name === findQuiz.name) {
      if (quiz.authUserId === findTarget.userId) {
        throw HTTPError(400, 'userEmail already owns a quiz with the same name.');
      }
    }
  }

  // Transfers ownership to user belonging to userEmail.
  findQuiz.authUserId = findTarget.userId;

  setData(data);
  return {};
}

/**
 * adminQuizQuestionCreate takes in a quizId, the user's token and as well as a questionBody containing
 * the relevant information for the question. The function begins by finding iterating through the sessions
 * and quizzes array to get the relevant authUserId and quiz. The following error checks are then completed:
 * 1. Is the token valid?
 * 2. Is the Quiz Id Valid ?
 * 3. Does the User Own the Quiz ?
 * 4. Question Length Check
 * 5. No. Of Question Answers
 * 6. Question Duration
 * 7. Question Points
 * 8. Answer Lengths and Duplicates.
 * 9. Thumbnail
 * Following the error checks, the question will then be pushed onto the relevant quiz's question
 * array, and the quiz duration, last edited and number of questions field in the quiz object
 * is then updated.
 *
 * @param { number } quizId - Contains the relevant Quiz Id.
 * @param { string } token - Contains the user's current session token.
 * @param { Question } questionBody - An object containing question, duration, points and answers.
 *
 * @returns { object {questionId: number} } - Empty Object to indicate succesful addition of the question.
 */

function v2AdminQuizQuestionCreate(quizId: number, token: string, questionBody: Question): ErrorObject | QuestionId {
  const data = getData();
  const date = Math.floor(Date.now() / 1000);

  // Obtaining the relevant quiz and relevant authUserId.
  const findToken = data.sessions.find(ids => ids.token === token);
  const findQuiz = data.quizzes.find(quiz => quiz.quizId === quizId);

  // Error Checks for Token and QuizID
  if (!findToken) {
    throw HTTPError(401, 'Token is empty or invalid');
  }
  if (!findQuiz) {
    throw HTTPError(403, 'Quiz Id is invalid.');
  }
  if (findQuiz.authUserId !== findToken.userId) {
    throw HTTPError(403, 'User does not own this quiz.');
  }

  if (questionBody.thumbnailUrl === '') {
    throw HTTPError(400, 'ThumbnailUrl is an empty string');
  }

  if (!isValidThumbnailUrlEnding(questionBody.thumbnailUrl)) {
    throw HTTPError(400, 'ThumbnailUrl does not end with a image extension');
  }

  if (!isValidThumbnailUrlStarting(questionBody.thumbnailUrl)) {
    throw HTTPError(400, 'ThumbnailUrl does not end with http or https');
  }

  // Error Checks for the Question.
  const correctAnswers = questionBody.answers.find(bool => bool.correct === true);
  if (!correctAnswers) {
    throw HTTPError(400, 'No Correct Answers');
  } else if (questionBody.question.length > 50 || questionBody.question.length < 5) {
    throw HTTPError(400, 'Question Length is not between 5 and 50.');
  } else if (questionBody.answers.length > 6 || questionBody.answers.length < 2) {
    throw HTTPError(400, 'Number of Question Answers is not between 2 and 6.');
  } else if (questionBody.duration <= 0) {
    throw HTTPError(400, 'Question Duration is Not Positive.');
  } else if (questionBody.duration + findQuiz.duration > 180) {
    throw HTTPError(400, 'Quiz Duration is Longer than 3 minutes.');
  } else if (questionBody.points > 10 || questionBody.points < 1) {
    throw HTTPError(400, 'Quiz Points is Not Between 1 and 10.');
  }
  for (const answer of questionBody.answers) {
    if (answer.answer.length > 30 || answer.answer.length < 1) {
      throw HTTPError(400, 'Question Answer Length is not Between 1 and 30.');
    }
  }
  for (let i = 0; i < questionBody.answers.length; i++) {
    for (let j = i + 1; j < questionBody.answers.length; j++) {
      if (questionBody.answers[i].answer === questionBody.answers[j].answer) {
        throw HTTPError(400, 'There Are Duplicate ');
      }
    }
  }

  // Setting Up the Question and Answers to be Pushed Onto The Datastore
  const answerBody = [];
  for (const answer of questionBody.answers) {
    answerBody.push({
      answerId: data.answerIdCounter,
      answer: answer.answer,
      colour: getRandomColour(),
      correct: answer.correct,
    });
    data.answerIdCounter++;
  }

  // Pushing the question to the questionBody of the relevant quiz.
  const questionId = data.questionIdCounter;
  findQuiz.questions.push({
    questionId: questionId,
    question: questionBody.question,
    duration: questionBody.duration,
    points: questionBody.points,
    answers: answerBody,
    thumbnailUrl: questionBody.thumbnailUrl,
  });

  // Incrementing the questionIdCounter to ensure uniqueness in every questionid.
  data.questionIdCounter++;

  // Updating the fields in the quizId.
  findQuiz.duration += questionBody.duration;
  findQuiz.timeLastEdited = date;
  findQuiz.numQuestions++;

  setData(data);
  return { questionId: questionId };
}

/**
  * Function allows user to view information about a specified quiz, unless the inputted ID's, user
  * and quiz respectively, are invalid, then returns an error message.
  *
  * @param {string} token - token belonging to session of user trying to access quiz information.
  * @param {number} quizId - ID of quiz user is trying to access.
  *
  * @returns {
  *   return {
  *     quizId: number,
  *     name: string,
  *     timeCreated: number,
  *     timeLastEdited: number,
  *     description: string,
  *   }
  * } - Returns the quiz information user wants to access.
*/
function v2AdminQuizInfo(token: string, quizId: number): ErrorObject | QuizInfoReturn {
  const data = getData();
  const findToken = data.sessions.find(session => session.token === token);
  const findQuiz = data.quizzes.find(quiz => quiz.quizId === quizId);

  if (!findToken) {
    throw HTTPError(401, 'Token is empty or invalid');
  } else if (!findQuiz) {
    throw HTTPError(403, 'Quiz Id invalid.');
  }

  if (findToken.userId !== findQuiz.authUserId) {
    throw HTTPError(403, 'User does not own this quiz.');
  }

  setData(data);
  return {
    quizId: findQuiz.quizId,
    name: findQuiz.name,
    timeCreated: findQuiz.timeCreated,
    timeLastEdited: findQuiz.timeLastEdited,
    description: findQuiz.description,
    numQuestions: findQuiz.numQuestions,
    duration: findQuiz.duration,
    questions: findQuiz.questions,
    thumbnailUrl: findQuiz.thumbnailUrl,
  };
}

/**
 * The function will return an empty object while updating the values given in the questionBody
 * given valid token, quizId and questionId
 * It should return an error if any of these parameters are invalid.
 * @param {array} Question - the question array created in adminQuizQuestionCreate.
 *
 * @returns {} - on succesful calling of this function it will return an empty object
 */
function v2AdminQuizQuestionUpdate(questionBody: Question, token: string, quizId: number, questionId: number): ErrorObject | Record<string, never> {
  const data = getData();
  const date = Math.floor(Date.now() / 1000);

  const findToken = data.sessions.find(session => session.token === token);

  if (!findToken) {
    throw HTTPError(401, 'Token is empty or invalid');
  }

  const findQuiz = data.quizzes.find(quiz => quiz.quizId === quizId);

  if (!findQuiz) {
    throw HTTPError(403, 'Quiz ID does not refer to a valid quiz');
  }

  const findQuestion = findQuiz.questions.find(question => question.questionId === questionId);

  if (findQuiz.authUserId !== findToken.userId) {
    throw HTTPError(403, 'User does not own this quiz.');
  }
  if (!findQuestion) {
    throw HTTPError(400, 'Questions not found.');
  }

  if (questionBody.thumbnailUrl === '') {
    throw HTTPError(400, 'ThumbnailUrl is an empty string');
  }

  if (!isValidThumbnailUrlEnding(questionBody.thumbnailUrl)) {
    throw HTTPError(400, 'ThumbnailUrl does not end with a image extension');
  }

  if (!isValidThumbnailUrlStarting(questionBody.thumbnailUrl)) {
    throw HTTPError(400, 'ThumbnailUrl does not end with http or https');
  }

  // Error Checks for the Question.
  const trueAnswers = questionBody.answers.find(bool => bool.correct === true);
  if (!trueAnswers) {
    throw HTTPError(400, 'No True Answers');
  } else if (questionBody.question.length > 50 || questionBody.question.length < 5) {
    throw HTTPError(400, 'Question Length is not between 5 and 50.');
  } else if (questionBody.answers.length > 6 || questionBody.answers.length < 2) {
    throw HTTPError(400, 'Number of Question Answers is not between 2 and 6.');
  } else if (questionBody.duration <= 0) {
    throw HTTPError(400, 'Question Duration is Not Positive.');
  } else if (questionBody.duration + findQuiz.duration > 180) {
    throw HTTPError(400, 'Quiz Duration is Longer than 3 minutes.');
  } else if (questionBody.points > 10 || questionBody.points < 1) {
    throw HTTPError(400, 'Quiz Points is Not Between 1 and 10.');
  }

  for (const answer of questionBody.answers) {
    if (answer.answer.length > 30 || answer.answer.length < 1) {
      throw HTTPError(400, 'Question Answer Length is not Between 1 and 30.');
    }
  }

  for (let i = 0; i < questionBody.answers.length; i++) {
    for (let j = i + 1; j < questionBody.answers.length; j++) {
      if (questionBody.answers[i].answer === questionBody.answers[j].answer) {
        throw HTTPError(400, 'There Are Duplicate ');
      }
    }
  }

  findQuestion.answers = questionBody.answers.map(answer => ({
    answerId: data.answerIdCounter++,
    answer: answer.answer,
    colour: getRandomColour(),
    correct: answer.correct,
  }));

  // Updating the question properties
  findQuestion.duration = questionBody.duration;
  findQuestion.points = questionBody.points;
  findQuestion.question = questionBody.question;
  findQuestion.thumbnailUrl = questionBody.thumbnailUrl;
  // Recalculate the total duration of the quiz

  let totalDuration = 0;
  for (const question of findQuiz.questions) {
    totalDuration += question.duration;
  }
  findQuiz.duration = totalDuration; // Update the total quiz duration

  findQuiz.timeLastEdited = date;

  setData(data);
  return {};
}

/**
 * adminQuizQuestionDelete takens in the user's current token, relevant quizId and the questionId
 * of the question they want to change. Function begins by iteration through the sessions array and
 * the quizzes array to find the relevant authUserId and quiz. Then it does the following error checks:
 * 1. Is the token valid ?
 * 2. Is the Quiz Id valid ?
 * 3. Does the User Own This Quiz ?
 * 4. Is any session for this quiz In END state?
 * Following that, the relevant question's index is obtained and is then checked to see whether the question exists.
 * If it does, the question is then deleted.
 *
 * @param { string } token - Contains the user's current session token.
 * @param { number } quizId - Contains the relevant quiz Id.
 * @param { number } questionId - Contains the relevant question Id.
 *
 * @returns { Empty Object } - Empty Object to indicate succesful addition of the question.
 */
function v2adminQuizQuestionDelete(token: string, quizId: number, questionId: number): ErrorObject | Record<string, never> {
  const data = getData();

  // Finds the authUserId, quiz and that quiz's index.
  const findToken = data.sessions.find(ids => ids.token === token);
  const findQuiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  const findQuizIndex = data.quizzes.findIndex(quiz => quiz.quizId === quizId);

  // Error Checks for Token and QuizID
  if (!findToken) {
    throw HTTPError(401, 'Token is empty or invalid');
  } else if (!findQuiz) {
    throw HTTPError(403, 'Quiz Id is invalid.');
  } else if (findQuiz.authUserId !== findToken.userId) {
    throw HTTPError(403, 'User does not own this quiz.');
  }

  for (const activeSessions of data.quizActiveState) {
    if (activeSessions.metadata.quizId === quizId) {
      if (activeSessions.state !== States.END) {
        throw HTTPError(400, 'Any session for this quiz is not in END state');
      }
    }
  }

  // Finds the relevant question's index.
  const findQuestionIndex = data.quizzes[findQuizIndex].questions.findIndex(question => question.questionId === questionId);

  // If it doesn't exist, returns an error.
  if (findQuestionIndex === -1) {
    throw HTTPError(400, 'Question Invalid.');
  }

  // Deleting the Question
  data.quizzes[findQuizIndex].questions.splice(findQuestionIndex, 1);

  setData(data);
  return {};
}
/**
 * adminQuizSessions will return a list of all active and inactive sessions for a given quiz. A session is
 * considered inactive when it is at the END state and active on every other state.
 * This should check if:
 *  - The token is valid (empty or doesn't belong to a user)
 *  - The user does not own the quiz or the quizId does not exist
 *
 * @param {string} token
 * @param {number} quizId
 * @returns {object {
 * activeSessions: number[],
 * inactiveSessions: number[]
 * }}
 */
function adminQuizSessions (token: string, quizId: number): ErrorObject | QuizSessionReturn {
  const data = getData();

  // Finds the authUserId, quiz and that quiz's index.
  const findToken = data.sessions.find(ids => ids.token === token);
  const findQuiz = data.quizzes.find(quiz => quiz.quizId === quizId);

  // Error Checks for Token and QuizID
  if (!findToken) {
    throw HTTPError(401, 'Token is empty or invalid');
  } else if (!findQuiz) {
    throw HTTPError(403, 'Quiz Id is invalid.');
  } else if (findQuiz.authUserId !== findToken.userId) {
    throw HTTPError(403, 'User does not own this quiz.');
  }

  const activeSessions = [];
  const inactiveSessions = [];

  for (const sessionsOfQuiz of data.quizActiveState) {
    if (sessionsOfQuiz.metadata.quizId === quizId) {
      if (sessionsOfQuiz.state === States.END) {
        inactiveSessions.push(sessionsOfQuiz.sessionId);
      } else {
        activeSessions.push(sessionsOfQuiz.sessionId);
      }
    }
  }

  setData(data);
  return {
    activeSessions: activeSessions,
    inactiveSessions: inactiveSessions,
  };
}
/**
 * adminQuizGetSessionStatus gets info about the given session, i.e state, atquestion
 * players, and the quiz.
 *
 * @param {number} quizId
 * @param {number} sessionId
 * @param {string} token
 *
 * @returns {
 *  object {
 *    state: string,
 *    atQuestion: number,
 *    players: string[],
 *    metadata: Quiz
 * }}
 */
function adminQuizGetSessionStatus (quizId: number, sessionId: number, token: string): ErrorObject | SessionStatusReturn {
  const data = getData();

  // Finds the authUserId, quiz and that quiz's index.
  const findToken = data.sessions.find(ids => ids.token === token);
  const findQuiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  const findSession = data.quizActiveState.find(session => session.sessionId === sessionId);

  // Error Checks for Token and QuizID
  if (!findToken) {
    throw HTTPError(401, 'Token is empty or invalid');
  } else if (!findQuiz) {
    throw HTTPError(403, 'Quiz Id is invalid.');
  } else if (findQuiz.authUserId !== findToken.userId) {
    throw HTTPError(403, 'User does not own this quiz.');
  }
  if (!findSession) {
    throw HTTPError(400, 'SessionId is invalid');
  }

  const newPlayers = [];

  for (const players of findSession.players) {
    newPlayers.push(players.name);
  }

  const metadata = {
    quizId: findSession.metadata.quizId,
    name: findSession.metadata.name,
    timeCreated: findSession.metadata.timeCreated,
    timeLastEdited: findSession.metadata.timeLastEdited,
    description: findSession.metadata.description,
    numQuestions: findSession.metadata.numQuestions,
    questions: findSession.metadata.questions,
    duration: findSession.metadata.duration,
    thumbnailUrl: findSession.metadata.thumbnailUrl,
  };

  setData(data);
  return {
    state: findSession.state,
    atQuestion: findSession.atQuestion,
    players: newPlayers,
    metadata: metadata,
  };
}
/**
 * adminQuizQuestionResult will return an object containing the questionId, the list
 * of players who got the question correct, the average answer time and the percentage of people
 * who got it correct. It calls getQuestionResult, which contains the logic to caculate the average
 * time and percentagecorrect, as well as push all players who got it correct into the CorrectList array.
 *
 * @param {number} playerid
 * @param {number} questionPosition
 *
 * @returns {Object {
 * questionId: number,
 * playersCorrectList: string[],
 * averageAnswerTimer: number,
 * percentagecorrect: number
 * }}
 */
function adminQuizQuestionResults(playerid: number, questionPosition: number): ErrorObject | QuestionResultsReturn {
  const data = getData();

  // Double for loop, to iterate through two arrays.

  let session: quizState | undefined;
  for (const sessions of data.quizActiveState) {
    for (const player of sessions.players) {
      if (player.playerId === playerid) {
        session = sessions;
      }
    }
  }

  // Error Checks
  if (session === undefined) {
    throw HTTPError(400, 'player ID does not exist');
  }

  if (session.state !== States.ANSWER_SHOW) {
    throw HTTPError(400, 'Session is not in ANSWER_SHOW state');
  }
  if (questionPosition > session.metadata.numQuestions) {
    throw HTTPError(400, 'question position is not valid for the session this player is in');
  }

  if (questionPosition !== session.atQuestion) {
    throw HTTPError(400, 'session is not yet up to this question');
  }

  setData(data);
  return getQuestionResults(session, questionPosition);
}

/**
 * The adminQuizFinalResults will get the total final results for session given a playerId, returning
 * a ranked list of all the player performances and and array of Questoin results identical to the return
 * of adminQuizQuestionResults
 *
 * @param {number} playerId
 * @returns {object {
 * usersRankedbyScore: UserRanks[];
 * questionResults: QuestionResultsReturn[];
 * }}
 */
function adminQuizFinalResults(playerId: number): ErrorObject | FinalScoreReturn {
  const data = getData();

  // Double for loop, to iterate through two arrays.

  let session: quizState | undefined;
  for (const sessions of data.quizActiveState) {
    for (const player of sessions.players) {
      if (player.playerId === playerId) {
        session = sessions;
      }
    }
  }

  // Error Checks
  if (session === undefined) {
    throw HTTPError(400, 'player ID does not exist');
  }

  if (session.state !== States.FINAL_RESULTS) {
    throw HTTPError(400, 'Session is not in FINAL_RESULTS state');
  }

  setData(data);
  return getFinalScoreSummary(session);
}
/**
 * adminQuizCompletedQuizResults will do the same thing as adminQuizFinalResults but,
 * given a valid quizId, sessionId and token and will return the exact same thing as quizFinalResults
 *
 * @param {number} quizId
 * @param {number} sessionId
 * @param {string} token
 * @returns {object {
 * usersRankedbyScore: UserRanks[];
 * questionResults: QuestionResultsReturn[];
 * }}
 */
function adminQuizCompletedQuizResults(quizId: number, sessionId: number, token: string): ErrorObject | FinalScoreReturn {
  const data = getData();

  // Double for loop, to iterate through two arrays.

  let session: quizState | undefined;
  for (const sessions of data.quizActiveState) {
    if (sessions.sessionId === sessionId) {
      session = sessions;
    }
  }

  // Error Checks
  if (session === undefined) {
    throw HTTPError(400, 'Session does not exist');
  }

  if (session.state !== States.FINAL_RESULTS) {
    throw HTTPError(400, 'Session is not in FINAL_RESULTS state');
  }

  const searchToken = data.sessions.find(session => session.token === token);
  if (!searchToken) {
    throw HTTPError(401, 'Token is empty or invalid');
  }

  const findQuiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  if (!findQuiz) {
    throw HTTPError(403, 'Quiz ID does not refer to a valid quiz');
  }
  if (findQuiz.authUserId !== searchToken.userId) {
    throw HTTPError(403, 'User does not own this quiz.');
  }

  setData(data);
  return getFinalScoreSummary(session);
}
/**
 * adminQuizPlayerStatus will, given a valid player in the session, returns the
 * current state of the session, the question the session is at, and the number of questions
 * in the session.
 * @param {number} playerid
 * @returns {object {
 * state: string,
 * numQuestions: number,
 * atQuestion: number
 * }}
 */
function adminQuizPlayerStatus (playerid: number): ErrorObject | QuizPlayerReturn {
  const data = getData();

  let session: quizState | undefined;
  for (const sessions of data.quizActiveState) {
    for (const players of sessions.players) {
      if (players.playerId === playerid) {
        session = sessions;
      }
    }
  }

  if (session === undefined) {
    throw HTTPError(400, 'player ID does not exist');
  }

  setData(data);
  return {
    state: session.state,
    numQuestions: session.metadata.numQuestions,
    atQuestion: session.atQuestion,
  };
}
/**
 * adminQuizPlayerQuestionInformation will get the information about a question a valid player is currently on.
 *
 * @param {number} playerid - The id of the player we want to read the questioninformation off of
 * @param {number} questionposition - the question the player is currentlly on.
 *
 * @returns {Question object} - returns the question object
 * {
 * questionId?: number;
 * question: string;
 * duration: number;
 * points: number;
 * answers: Answer[];
 * thumbnailUrl?: string;} when successful
 */
function adminQuizPlayerQuestionInformation (playerid: number, questionposition: number): ErrorObject | Question {
  const data = getData();

  let session: quizState | undefined;
  for (const sessions of data.quizActiveState) {
    for (const players of sessions.players) {
      if (players.playerId === playerid) {
        session = sessions;
      }
    }
  }

  if (session === undefined) {
    throw HTTPError(400, 'player ID does not exist');
  }

  if (session.atQuestion !== questionposition) {
    throw HTTPError(400, 'session is not currently on this question');
  }

  if (questionposition > session.metadata.numQuestions || questionposition < 1) {
    throw HTTPError(400, 'Question position not valid for the session');
  }

  if (session.state === States.LOBBY || session.state === States.QUESTION_COUNTDOWN ||
      session.state === States.END) {
    throw HTTPError(400, 'Session is in LOBBY, QUESTION_COUNTDOWN, or END state');
  }

  setData(data);
  return {
    questionId: session.metadata.questions[questionposition - 1].questionId,
    question: session.metadata.questions[questionposition - 1].question,
    duration: session.metadata.questions[questionposition - 1].duration,
    thumbnailUrl: session.metadata.questions[questionposition - 1].thumbnailUrl,
    points: session.metadata.questions[questionposition - 1].points,
    answers: session.metadata.questions[questionposition - 1].answers,
  };
}
/**
 * adminQuizChat will show all chat messages in a given session, given a valid playerId in said session.
 * The chat messages should be formated as so:
 * {
 * "messageBody": "This is a message body",
 * "playerId": 5546,
 * "playerName": "Yuchao Jiang",
 * "timeSent": 1683019484
 * },
 *
 * @param {number} playerid - the player who is view the session chat
 * @returns {object: Message[]} - return an array of message objects in order of when they were sent
 */
function adminQuizChat (playerid: number): ErrorObject | ChatReturn {
  const data = getData();

  let session: quizState | undefined;
  for (const sessions of data.quizActiveState) {
    for (const players of sessions.players) {
      if (players.playerId === playerid) {
        session = sessions;
      }
    }
  }

  if (session === undefined) {
    throw HTTPError(400, 'player ID does not exist');
  }

  setData(data);
  return {
    messages: session.messages,
  };
}
/**
 * adminQuizChatSend allows an valid player in session to be able to send a chat message to said Session.
 * The message should not be empty or more than 100 characters
 *
 * @param {number} playerid - the player who will send the message
 * @param {string} messageBody - the message the player wishes to send
 * @returns {object {}}
 */
function adminQuizChatSend (playerid: number, messageBody: string): ErrorObject | Record<string, never> {
  const data = getData();

  let session: quizState | undefined;
  let name: string | undefined;
  for (const sessions of data.quizActiveState) {
    for (const players of sessions.players) {
      if (players.playerId === playerid) {
        session = sessions;
        name = players.name;
      }
    }
  }

  if (session === undefined) {
    throw HTTPError(400, 'player ID does not exist');
  }

  if (messageBody.length < 1 || messageBody.length > 100) {
    throw HTTPError(400, ' message body is less than 1 character or more than 100 characters');
  }

  session.messages.push({
    messageBody: messageBody,
    playerId: playerid,
    playerName: name,
    timeSent: Math.floor(Date.now() / 1000),
  });

  setData(data);
  return {};
}
/**
 * adminQuizFinalResultsCSV formats adminQuizFinalResults to make it a valid .csv file.
 * It will check if the csv-results directory exists and make on if it doesn't. It will then
 * create a csv file containing the finalresults of a given session
 *
 * @param {number} quizId- the quiz in the session
 * @param {number} sessionId - the session that the final results will be gotten from
 * @param {string} token - The token of the user requesting the final results.
 * @returns {object {url: string}}
 */
function adminQuizFinalResultsCSV(quizId: number, sessionId: number, token: string) {
  const data = getData();

  // Double for loop, to iterate through two arrays.

  let session: quizState | undefined;
  for (const sessions of data.quizActiveState) {
    if (sessions.sessionId === sessionId) {
      session = sessions;
    }
  }

  // Error Checks
  const searchToken = data.sessions.find(session => session.token === token);
  if (!searchToken) {
    throw HTTPError(401, 'Token is empty or invalid');
  }

  const findQuiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  if (!findQuiz) {
    throw HTTPError(403, 'Quiz ID does not refer to a valid quiz');
  }
  if (findQuiz.authUserId !== searchToken.userId) {
    throw HTTPError(403, 'User does not own this quiz.');
  }

  if (session === undefined) {
    throw HTTPError(400, 'Session does not exist');
  }

  if (session.metadata.quizId !== quizId) {
    throw HTTPError(400, 'Session Is Not Currently Running for this Quiz');
  }

  if (session.state !== States.FINAL_RESULTS) {
    throw HTTPError(400, 'Session is not in FINAL_RESULTS state');
  }

  const csvFormattedResults = getFinalScoreCSVFormatted(session);

  const filename = '/csv-results/CSVscore' + JSON.stringify(sessionId) + '.csv';
  if (!fs.existsSync('./csv-results')) {
    fs.mkdirSync('./csv-results');
  }
  fs.writeFileSync('.' + filename, csvFormattedResults);

  setData(data);
  return { url: DEPLOYED_URL + filename };
}

/// ////////////////////////////////////////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////////////////////////
/// //////////////////////////////////// HELPER FUNCTIONS //////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////////////////////////

function generateRandomName(): string {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  let name = '';

  // Generate 5 random letters
  for (let i = 0; i < 5; i++) {
    name += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  // Generate 3 random numbers without repetitions
  const numbers = Array.from({ length: 10 }, (_, i) => i.toString());
  const shuffledNumbers = numbers.sort(() => Math.random() - 0.5);
  name += shuffledNumbers.slice(0, 3).join('');

  return name;
}

function quizWaitThreeHelper (session: quizState): Record<string, never> {
  const findSession = timeoutIds.findIndex(ids => ids.sessionId === session.sessionId);
  timeoutIds.splice(findSession, 1);
  quizSkipCountdownHelper(session);

  setData(getData());
  return {};
}

function quizSkipCountdownHelper (session: quizState): Record<string, never> {
  session.state = States.QUESTION_OPEN;
  session.atQuestion++;

  clearTimeoutId(session);

  const duration = session.metadata.questions[session.atQuestion - 1].duration;

  const timeoutId = setTimeout(quizOpenQuestionDurationHelper, duration * 1000, session);

  timeoutIds.push({
    sessionId: session.sessionId,
    timeoutId: timeoutId
  });

  for (const player of session.players) {
    player.questions.push({
      questionId: session.metadata.questions[session.atQuestion - 1].questionId,
      timeStart: Math.floor(Date.now() / 1000),
      timeEnd: Math.floor(Date.now() + duration),
      timeTaken: duration,
      isCorrect: false,
      answers: [],
    });
  }

  setData(getData());
  return {};
}

function quizOpenQuestionDurationHelper (session: quizState): Record<string, never> {
  session.state = States.QUESTION_CLOSE;
  rankScorePlayers(session);
  const findSession = timeoutIds.findIndex(ids => ids.sessionId === session.sessionId);
  timeoutIds.splice(findSession, 1);

  setData(getData());
  return {};
}

function clearTimeoutId (session: quizState): Record<string, never> {
  const findSession = timeoutIds.findIndex(ids => ids.sessionId === session.sessionId);
  if (findSession !== -1) {
    clearTimeout(timeoutIds[findSession].timeoutId);
    timeoutIds.splice(findSession, 1);
  }

  setData(getData());
  return {};
}

function quizCountdownHelper (session: quizState, action: string): Record<string, never> {
  if (action === Actions.SKIP_COUNTDOWN) {
    quizSkipCountdownHelper(session);
  } else if (action === Actions.END) {
    session.state = States.END;
    clearTimeoutId(session);
  } else {
    throw HTTPError(400, 'Action enum cannot be applied in the current state');
  }
  setData(getData());
  return {};
}

function quizOpenHelper (session: quizState, action: string): Record<string, never> {
  if (action === Actions.GO_TO_ANSWER) {
    clearTimeoutId(session);
    rankScorePlayers(session);
    session.state = States.ANSWER_SHOW;
  } else if (action === Actions.END) {
    clearTimeoutId(session);
    rankScorePlayers(session);
    session.state = States.END;
  } else {
    // Finds the duration of the questions it's currently at, and waits that long till switching
    // state
    throw HTTPError(400, 'Action enum cannot be applied in the current state');
  }
  setData(getData());
  return {};
}

function quizCloseHelper (session: quizState, action: string): Record<string, never> {
  if (action === Actions.GO_TO_ANSWER) {
    session.state = States.ANSWER_SHOW;
  } else if (action === Actions.END) {
    session.state = States.END;
  } else if (action === Actions.NEXT_QUESTION) {
    session.state = States.QUESTION_COUNTDOWN;
    const timeoutId = setTimeout(quizWaitThreeHelper, 3 * 1000, session);
    timeoutIds.push({
      sessionId: session.sessionId,
      timeoutId: timeoutId
    });
  } else if (action === Actions.GO_TO_FINAL_RESULTS) {
    session.state = States.FINAL_RESULTS;
  } else {
    throw HTTPError(400, 'Action enum cannot be applied in the current state');
  }
  setData(getData());
  return {};
}

function quizShowHelper (session: quizState, action: string): Record<string, never> {
  if (action === Actions.NEXT_QUESTION) {
    session.state = States.QUESTION_COUNTDOWN;
    const timeoutId = setTimeout(quizWaitThreeHelper, 3 * 1000, session);
    timeoutIds.push({
      sessionId: session.sessionId,
      timeoutId: timeoutId
    });
  } else if (action === Actions.GO_TO_FINAL_RESULTS) {
    session.state = States.FINAL_RESULTS;
  } else if (action === Actions.END) {
    session.state = States.END;
  } else {
    throw HTTPError(400, 'Action enum cannot be applied in the current state');
  }
  setData(getData());
  return {};
}

function quizFinalHelper (session: quizState, action: string): ErrorObject | Record<string, never> {
  if (action === Actions.END) {
    session.state = States.END;
    setData(getData());
    return {};
  } else {
    throw HTTPError(400, 'Action enum cannot be applied in the current state');
  }
}

function getRandomColour(): string {
  const random = Math.floor((Math.random() * 7 + 1));
  if (random === 1) {
    return 'red';
  } else if (random === 2) {
    return 'blue';
  } else if (random === 3) {
    return 'green';
  } else if (random === 4) {
    return 'yellow';
  } else if (random === 5) {
    return 'purple';
  } else if (random === 6) {
    return 'brown';
  } else {
    return 'orange';
  }
}

function isValidThumbnailUrlEnding(thumbnailUrl: string): boolean {
  // Regular expression to match if the thumbnailUrl ends with jpg, jpeg, or png
  const validExtensions = /\.(jpg|jpeg|png)$/i;

  // Test if the thumbnailUrl matches the valid extensions
  return validExtensions.test(thumbnailUrl);
}

function isValidThumbnailUrlStarting(thumbnailUrl: string): boolean {
  // Regular expression to match if the thumbnailUrl begins with http:// or https://
  const validPrefix = /^(http|https):\/\//i;

  // Test if the thumbnailUrl starts with the valid prefix
  return validPrefix.test(thumbnailUrl);
}

function getQuestionResults(session: quizState, questionPosition: number): QuestionResultsReturn {
  const playersCorrectList = [];
  let averageAnswerTime = 0;

  // Pushing People onto the Array Who got the Question Right and tracking response time
  for (const player of session.players) {
    if (player.questions[questionPosition - 1].isCorrect === true) {
      playersCorrectList.push(player.name);
    }
    averageAnswerTime += player.questions[questionPosition - 1].timeTaken;
  }

  // Calculating Average and Correct Percentage
  averageAnswerTime = Math.round(averageAnswerTime / session.players.length);
  const percentageCorrect = Math.round((playersCorrectList.length / session.players.length) * 100);

  setData(getData());
  return {
    questionId: session.metadata.questions[questionPosition - 1].questionId,
    playersCorrectList: playersCorrectList,
    averageAnswerTime: averageAnswerTime,
    percentageCorrect: percentageCorrect,
  };
}

function getFinalScoreSummary(session: quizState): FinalScoreReturn {
  // Calculating Scores for Each Player
  const usersRankedByScore = [];
  for (const player of session.players) {
    usersRankedByScore.push({
      name: player.name,
      score: player.score,
    });
  }
  // Sorting the Users by Score In Descending Order
  usersRankedByScore.sort((a, b) => {
    return b.score - a.score;
  });

  // Pushing on the QuestionResults for each Question.
  const questionResults = [];
  for (let i = 0; i < session.metadata.numQuestions; i++) {
    questionResults.push(getQuestionResults(session, i + 1));
  }

  setData(getData());
  return {
    usersRankedByScore: usersRankedByScore,
    questionResults: questionResults,
  };
}

function rankScorePlayers(session: quizState): Record<string, never> {
  const allplayers = session.players;
  const atQuestion = session.atQuestion - 1;
  const questionPoints = session.metadata.questions[atQuestion].points;
  const rankedArray: Player[] = [];
  const incorrectPlayers: Player[] = [];

  let player: Player;
  for (player of allplayers) {
    if (player.questions[atQuestion].isCorrect === false) {
      incorrectPlayers.push(player);
    } else {
      rankedArray.push(player);
    }
  }
  rankedArray.sort((a, b) => a.questions[atQuestion].timeTaken - b.questions[atQuestion].timeTaken);
  let rank = 1;
  for (player of rankedArray) {
    const findPlayer = session.players.find(ids => ids.playerId === player.playerId);
    findPlayer.rank.push(rank);
    findPlayer.scorePer.push(questionPoints * 1 / rank);
    findPlayer.score += questionPoints * 1 / rank;
    rank++;
  }

  for (player of incorrectPlayers) {
    const findPlayer = session.players.find(ids => ids.playerId === player.playerId);
    findPlayer.rank.push(rank);
    findPlayer.scorePer.push(0);
  }

  setData(getData());
  return {};
}

function getFinalScoreCSVFormatted(session: quizState) {
  const allplayers = session.players;
  allplayers.sort((a, b) => a.name.localeCompare(b.name));
  let csvFormattedResults = '';
  for (const player of allplayers) {
    csvFormattedResults += player.name;
    for (let i = 0; i < session.metadata.numQuestions; i++) {
      csvFormattedResults += ',' + player.scorePer[i];
      csvFormattedResults += ',' + player.rank[i];
    }
    csvFormattedResults += '\n';
  }
  return csvFormattedResults;
}

export {
  adminQuizSessionCreate,
  adminQuizSessionUpdate,
  adminQuizPlayerSubmitAnswer,
  adminQuizSessionJoin,
  adminQuizThumbnailUpdate,
  v2adminQuizRemove,
  v2adminQuizTransfer,
  v2adminQuizCreate,
  v2AdminQuizQuestionCreate,
  v2AdminQuizInfo,
  v2AdminQuizQuestionUpdate,
  v2adminQuizQuestionDelete,
  adminQuizSessions,
  adminQuizGetSessionStatus,
  adminQuizQuestionResults,
  adminQuizFinalResults,
  adminQuizCompletedQuizResults,
  adminQuizChat,
  adminQuizChatSend,
  adminQuizPlayerQuestionInformation,
  adminQuizPlayerStatus,
  adminQuizFinalResultsCSV,
};
