import { getData } from './dataStore';
import {
  ErrorObject,
  EmptyObject,
  QuizListReturnObject,
  QuizListInfo,
  QuizInfoReturn,
  QuizId
} from './interfaces';
let quizIdcounter = 0;

/**
  * <Given a registered user's id, a quizId that is valid, and a name that matches specified
	* criteria, the quizId specified will have their name changed to the name parameter>
  *
  * @param {number} authUserId - UserId which may or not be registered in the data
  * @param {number} quizId - quizId that may or may not correlate with a quiz in the data.
	* @param {string} name - string that User wants the specified quizId to change the name to
  *
  * @returns {object { }} returns empty object if no error and parameters match specified criteria.
  * @returns {object {error: string}} returns specified error message
*/
function adminQuizNameUpdate(token: string, quizId: number, name: string): ErrorObject | EmptyObject {
  const newdata = getData();
  let searchUserId;
  const isAlphanumeric = /^[a-zA-Z0-9 ]+$/.test(name);
  const date = Math.floor(Date.now() / 1000);
  let flag = false;


  for (const data of newdata.sessions) {
    if (token === data.token) {
      searchUserId = data.userId;
      flag = true;
      break;
    }
  }

  if (!flag) {
    return {
      error: 'does not refer to valid logged in user session',
    };
  }

  if (!isAlphanumeric) {
    return { error: 'Quiz Name contains invalid characters' };
  }

  if (name.length < 3 || name.length > 30) {
    return { error: 'Quiz Name must be more than 2 chracters and less than 31 characters long' };
  }

  const courseData = newdata.quizzes;

  for (const i of courseData) {
    if (i.authUserId === searchUserId) {
      if (i.name === name) {
        return { error: 'Quiz name already in use' };
      }
    }
  }

  flag = false;
  for (let i = 0; i < newdata.quizzes.length; i++) {
    const data = newdata.quizzes[i];
    if (quizId === data.quizId) {
      if (data.authUserId === searchUserId) {
        flag = true;
        data.name = name;
        data.timeLastEdited = date;
        break;
      } else {
        return {
          error: 'Quiz ID does not refer to a quiz that this user owns.'
        };
      }
    }
  }

  if (!flag) {
    return {
      error: 'Quiz ID does not refer to a valid quiz',
    };
  }

  return { }; // Empty object
}

/**
  * <Given a registered userId and quizId, delete the quiz from data storage.>
  *
  * @param {number} authUserId - userId which may or may not be registered in the data
  * @param {number} quizId - quizId which may or may not be registered in the data
  *
  * @returns {object { }} returns empty object if function went successful
  * @returns {object {error: string}} returns specified error message
*/
function adminQuizRemove(token: string, quizId: number): ErrorObject | EmptyObject {
  const newdata = getData();

  let flag = false;
  let currentUserId;

  for (const data of newdata.sessions) {
    if (token === data.token) {
      currentUserId = data.userId;
      flag = true;
      break;
    }
  }

  if (!flag) {
    return {
      error: 'does not refer to valid logged in user session',
    };
  }

  flag = false;
  for (let i = 0; i < newdata.quizzes.length; i++) {
    const data = newdata.quizzes[i];
    if (quizId === data.quizId) {
      if (data.authUserId === currentUserId) {
        flag = true;
        data.timeLastEdited = Math.floor(Date.now() / 1000);
        newdata.trash.push(data);
        newdata.quizzes.splice(i, 1);
        break;
      } else {
        return {
          error: 'Quiz ID does not refer to a quiz that this user owns.'
        };
      }
    }
  }

  if (!flag) {
    return {
      error: 'Quiz ID does not refer to a valid quiz',
    };
  }

  return { }; // Empty object
}

/**
 * The function will return a list of quizes in the datastore containing information about
 * its quizId and its name, given a valid User Id.
 * It should return an error if the user Id is not valid.
 * @param {Number} authUserId - the user Id created from adminAuthRegister
 * @return {Object {error: string}} - If an error is occurs, it will return an error object with a string
 * @return {Object {quizzes: Array}} - an Array of quizzes ojects that have quizId and name
 */
function adminQuizList(token: string): ErrorObject | QuizListReturnObject {
  const newdata = getData();
  const activeTokens = newdata.sessions
  const searchToken = activeTokens.findIndex(session => session.token  === token);

  if (searchToken === -1) {
    return {
      error: 'invalid user Id'
    };
  }

  const quizList = newdata.quizzes.map(quizes => ({
    quizId: quizes.quizId,
    name: quizes.name,
  }));

  return {
    quizzes: quizList
  };
}

/**
  * Function allows user to view information about a specified quiz, unless the inputted ID's, user
  * and quiz respectively, are invalid, then returns an error message.
  *
  * @param {string} token - token belonging to session of user trying to access quiz information.
  * @param {number} quizId - ID of quiz user is trying to access.
  *
  * @returns {
*   object {
  *     error: string
  *   }
  * } - Error object with information regarding error.
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
function adminQuizInfo(token: string, quizId: number): ErrorObject | QuizInfoReturn {
  const data = getData();
  const findToken = data.sessions.find(session => session.token === token);
  const findQuiz = data.quizzes.find(session => session.quizId === quizId);

  if (!findToken) {
    return { error: 'Token invalid.' };
  } else if (!findQuiz) {
    return { error: 'Quiz Id invalid.' };
  }

  if (findToken.userId !== findQuiz.authUserId) {
    return { error: 'User does not own this quiz.' };
  }

  return {
    quizId: findQuiz.quizId,
    name: findQuiz.name,
    timeCreated: findQuiz.timeCreated,
    timeLastEdited: findQuiz.timeLastEdited,
    description: findQuiz.description,
  };
}

/**
 * adminQuizCreate will create a new quiz and push all of its information (quizId, name, description,
 * user Id, time create, last time edited) into dataStore it will return a unique quizId.
 *
 * @param {Int} authUserId - user id for the person creating the quiz
 * @param {string} name - The name of the quiz that is being created
 * @param {string} description - the description of the quiz being created
 *
 * @return {object {error: string}} - returns an error string if an the correct error
 * is encountered
 *
 * @return {object {quizId: number}} - returns a quiz Id object that contains the unique quiz Id relating
 * to the created quiz.
 */

function adminQuizCreate(token: string, name: string, description: string): ErrorObject | QuizId {
  const newdata = getData();
  const activeTokens = newdata.sessions;
  const searchToken = activeTokens.findIndex(session => session.token  === token);
  const isAlphanumeric = /^[a-zA-Z0-9 ]+$/.test(name);
  const date = Math.floor(Date.now() / 1000);

  if (searchToken === -1) {
    return { error: 'Token is not valid' };
  }

  if (!isAlphanumeric) {
    return { error: 'Quiz Name contains invalid characters' };
  }

  if (name.length < 3 || name.length > 30) {
    return { error: 'Quiz Name must be more than 2 chracters and less than 31 characters long' };
  }

  const courseData = newdata.quizzes;
  let authUserId = activeTokens[searchToken].userId;
  
  for (const i of courseData) {
    if (i.authUserId === authUserId) {
      if (i.name === name) {
        return { error: 'Quiz name already in use' };
      }
    }
  }

  if (description.length > 100) {
    return { error: 'Description is more than 100 characters' };
  }

  quizIdcounter++;
  newdata.quizzes.push({
    quizId: quizIdcounter,
    name: name,
    description: description,
    authUserId: authUserId,
    timeCreated: date,
    timeLastEdited: date,
    questions: [],
    duration: 0,
  });

  return {
    quizId: quizIdcounter,
  };
}

/**
 * Function takes in token, QuizId and New Description and returns
 * an empty object if it passes all the error checks.
 * Otherwise, an error object will be returned containing the specific
 * error.
 *
 * Before changing the Quiz Description, the function checks for whether:
 * 	 1. Is Token Valid
 *   2. Is Quiz Id Valid
 *   3. Does the Quiz Belong to the user
 *   4. Is the Desc Under 100 words
 *
 * @param {integer} tokens - This is the user's current token for this session.
 * @param {string} quizId - This is the quiz id.
 * @param {string} description - This is the new description for the quiz.
 *
 * @returns {
 *   object {
 *     error: string
 *   }
 * } Error Object with information regarding the error.
 * @returns {
 *   object {
 *
 *   }
 * } Empty Object to indicidate that everything worked.
 *
*/

function adminQuizDescriptionUpdate(token: string, quizId: number, description: string): ErrorObject | EmptyObject {
  const data = getData();
  const date = Math.floor(Date.now() / 1000);

  const findToken = data.sessions.find(ids => ids.token === token);
  const findQuiz = data.quizzes.find(quiz => quiz.quizId === quizId);

  if (!findToken) {
    return { error: 'Token is Not Valid.'}
  }
  if (!findQuiz) {
    return { error: 'Quiz Id is invalid.'}
  }
  if (findQuiz.authUserId !== findToken.userId) {
    return { error: 'Quiz Does Not Belong to User' };
  }

  if (description.length > 100) {
    return { error: 'Description Too Long' };
  } else {
    findQuiz.description = description;
    findQuiz.timeLastEdited = date;
    return {};
  }
}

function adminQuizTransfer(token: string, userEmail: string, quizId: number) {
  return {};
}

export {
  adminQuizNameUpdate,
  adminQuizRemove,
  adminQuizList,
  adminQuizInfo,
  adminQuizCreate,
  adminQuizDescriptionUpdate,
  adminQuizTransfer,
};
