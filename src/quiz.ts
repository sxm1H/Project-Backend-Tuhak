import { isAlpha } from 'validator';
import { getData, setData } from './dataStore';
let quizIdcounter = 0;

interface ErrorObject {
  error: string;
}

interface EmptyObject {

}

interface QuizListReturObject {
  quizzes: QuizListInfo[];
}

interface QuizListInfo {
  quizId: number;
  name: string;
}

interface QuizInfoReturn {
  quizId: number;
  name: string;
  timeCreated: number;
  timeLastEdited: number;
  description: string;
}

interface QuizId {
  quizId: number;
}

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
function adminQuizNameUpdate(authUserId: number, quizId: number, name: string): ErrorObject | EmptyObject {

  let newdata = getData();
  let userData = newdata.user;
  let searchUserId = userData.findIndex(Ids => Ids.userId === authUserId);
  let isAlphanumeric = /^[a-zA-Z0-9 ]+$/.test(name);
  let date = Date.now();

  if (searchUserId === -1) {
    return {error: 'User Id is not valid'};
  }

  if (!isAlphanumeric) {
    return {error: 'Quiz Name contains invalid characters',};
  }

  if (name.length < 3 || name.length > 30 ) {
    return {error: 'Quiz Name must be more than 2 chracters and less than 31 characters long'};
  }

  let courseData = newdata.quizzes;

  for (let i of courseData) {
    if (i.authUserId === authUserId) {
      if (i.name === name) {
        return {error: 'Quiz name already in use'};
      }
    }
  }

  let flag = 0;
  for (let i = 0; i < newdata.quizzes.length; i++) {
    const data = newdata.quizzes[i];
    if (quizId === data.quizId) {
      if (data.authUserId === authUserId) {
        flag = 1;
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
function adminQuizRemove(authUserId: number, quizId: number): ErrorObject | EmptyObject {

  let newdata = getData();

  let flag = 0;

  for (const data of newdata.user) {
    if (authUserId === data.userId) {
      flag = 1;
      break;
    }
  }

  if (!flag) {
    return {
      error: 'authUserId is not a valid user.',
    };
  }

  flag = 0;
  for (let i = 0; i < newdata.quizzes.length; i++) {
    const data = newdata.quizzes[i];
    if (quizId === data.quizId) {
      if (data.authUserId === authUserId) {
        flag = 1;
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
function adminQuizList(authUserId: number): ErrorObject | QuizListReturObject {
  let newdata = getData();
  let serachUserId = newdata.user.findIndex(ids => ids.userId === authUserId);
  
  if (serachUserId === -1) {
    return {
      error: 'invalid user Id'
    };
  }

  let quizList =  newdata.quizzes.map(quizes => ({
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
  * @param {number} authUserId - ID of user trying to access quiz information.
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
function adminQuizInfo(authUserId: number, quizId: number): ErrorObject | QuizInfoReturn {
  let data = getData();
  let searchUserId = data.user.findIndex(Ids => Ids.userId === authUserId);
  let searchquizId = data.quizzes.findIndex(Ids => Ids.quizId === quizId);

  if (searchUserId === -1) {
    return { error: 'User Id is not valid.' };
  } else if ( searchquizId === -1) {
    return { error: 'Quiz Id is not valid.' };
  }

  let quizMatch = data.quizzes[searchquizId];

  if (authUserId !== quizMatch.authUserId) {
    return { error: 'User does not own this quiz.' };
  }

  return {
    quizId: quizMatch.quizId,
    name: quizMatch.name,
    timeCreated: quizMatch.timeCreated,
    timeLastEdited: quizMatch.timeLastEdited,
    description: quizMatch.description,
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

function adminQuizCreate(authUserId: number, name: string, description: string): ErrorObject | QuizId {
  let newdata = getData();
  let userData = newdata.user;
  let searchUserId = userData.findIndex(Ids => Ids.userId === authUserId);
  let isAlphanumeric = /^[a-zA-Z0-9 ]+$/.test(name);
  let date = Date.now();

  if (searchUserId === -1) {
    return {error: 'User Id is not valid'};
  }

  if (!isAlphanumeric) {
    return {error: 'Quiz Name contains invalid characters',};
  }

  if (name.length < 3 || name.length > 30 ) {
    return {error: 'Quiz Name must be more than 2 chracters and less than 31 characters long'};
  }

  let courseData = newdata.quizzes;

  for (let i of courseData) {
    if (i.authUserId === authUserId) {
      if (i.name === name) {
        return {error: 'Quiz name already in use'};
      }
    }
  }

  if (description.length > 100) {
    return {error: 'Description is more than 100 characters'};
  }

  quizIdcounter++;
  newdata.quizzes.push({
    quizId: quizIdcounter,
    name: name,
    description: description,
    authUserId: authUserId,
    timeCreated: date,
    timeLastEdited: date,
  });

  return {
    quizId: quizIdcounter,
  };
}

/**
 * Function takes in UserId, QuizId and New Description and returns 
 * an empty object if it passes all the error checks.
 * Otherwise, an error object will be returned containing the specific 
 * error.
 * 
 * Before changing the Quiz Description, the function checks for whether:
 * 	 1. Is Auth Id Valid
 *   2. Is Quiz Id Valid
 *   3. Does the Quiz Belong to the user
 *   4. Is the Desc Under 100 words
 *
 * @param {integer} authUserId - This is the user's id.
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

function adminQuizDescriptionUpdate(authUserId: number, quizId: number, description: string): ErrorObject | EmptyObject {
  let data = getData();
  let date = Date.now();

  if (data.user.findIndex(Ids => Ids.userId === authUserId) === -1) {
    return {
      error: 'Auth User ID invalid'
    };
  }

  let quizInfo;
  let flag = false;

  for (let i = 0; i < data.quizzes.length; i++) {
    if (data.quizzes[i].quizId === quizId) {
      quizInfo = data.quizzes[i];
      flag = true;
      if (quizInfo.authUserId !== authUserId) {
        return { error: 'Quiz Does Not Belong to User' };
      }
    }
  }

  if (flag === false) {
    return { error: 'Quiz ID Invalid' };
  }

  if (description.length > 100) {
    return { error: 'Description Too Long' };
  } else {
    quizInfo.description = description;
    quizInfo.timeLastEdited = date;
    return {};
  }
}


export {
  adminQuizNameUpdate,
  adminQuizRemove,
  adminQuizList,
  adminQuizInfo,
  adminQuizCreate,
  adminQuizDescriptionUpdate,
};

