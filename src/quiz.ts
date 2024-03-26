import {
  ErrorObject,
  EmptyObject,
  QuizListReturnObject,
  QuizListInfo,
  QuizInfoReturn,
  QuizId,
  QuestionId,
} from './interfaces';
import {
  getData,
  Question,
  Answer,
  counters,
} from './dataStore';

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

  counters.quizIdCounter++;
  newdata.quizzes.push({
    quizId: counters.quizIdCounter,
    name: name,
    description: description,
    authUserId: authUserId,
    timeCreated: date,
    timeLastEdited: date,
    questions: [],
    duration: 0,
  });

  return {
    quizId: counters.quizIdCounter,
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
  *   5. Does the  target user own a quiz of the same name.
  *
  * @param {string} token - This is the user's token for their session.
  * @param {string} userEmail - Email belonging to the target user.
  * @param {number} quizId - ID belonging to the quiz the logged in user wishes to transfer ownership of.
  *
  * @returns {object {error: string}} Error Object with information regarding the error.
  * @returns {object {}} Empty Object to indicidate that everything worked.
*/
function adminQuizTransfer(token: string, userEmail: string, quizId: number): ErrorObject | EmptyObject {
  let data = getData();

  // Returns session object corresponding the given token.
  const findToken = data.sessions.find(session => session.token === token);
  // Early error check as findToken is used later.
  if (!findToken) {
    return { error: 'Token invalid.' };
  }
  
  // Returns quiz object corresponding with given quizId.
  const findQuiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  // Returns target user object corresponding to given userEmail.
  const findTarget = data.user.find(user => user.email === userEmail);
  // Returns user object corresponding with current logged in user.
  const findUser = data.user.find(user => user.userId === findToken.userId);

  // Error checks userEmail and permissions.
  if (!findTarget) {
    return { error: `${userEmail} does not belong to any users.` };
  } else if (findUser.email === userEmail) {
    return { error: `${userEmail} belongs to the current logged user.` };
  } else if (findQuiz.authUserId !== findToken.userId) {
    return { error: 'User does not own this quiz.' };
  }
  
  // Check if the user with userEmail owns any quizzes with the same name as the quiz corresponding with quizId
  for (const quiz of data.quizzes) {
    if (quiz.name === findQuiz.name) {
      if (quiz.authUserId === findTarget.userId) {
        return { error: `${userEmail} already owns a quiz with the same name.`};
      }
    }
  }

  // Transfers ownership to user belonging to userEmail.
  findQuiz.authUserId === findTarget.userId;

  return {};
}

function getRandomColour(): string {
  let random = Math.floor((Math.random() + 1) * 7);
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
  } else if (random === 7) {
    return 'orange';
  }
}

function adminQuizQuestionCreate(quizId: number, token: string, questionBody: Question): ErrorObject | QuestionId {
  const data = getData();
  const date = Math.floor(Date.now() / 1000);

  const findToken = data.sessions.find(ids => ids.token === token);
  const findQuiz = data.quizzes.find(quiz => quiz.quizId === quizId);

  //Error Checks for Token and QuizID
  if (!findToken) {
    return { error: 'Token invalid.'}
  }
  if (!findQuiz) {
    return { error: 'Quiz Id is invalid.'}
  }
  if (findQuiz.authUserId !== findToken.userId) {
    return { error: 'User does not own this quiz.' };
  }

  //Error Checks for the Question.
  if (questionBody.question.length > 50 || questionBody.question.length < 5) {
    return { error: 'Question Length is not between 5 and 50.'};
  } else if (questionBody.answers.length > 6 || questionBody.answers.length < 2) {
    return { error: 'Number of Question Answers is not between 2 and 6.'};
  } else if (questionBody.duration < 0) {
    return { error: 'Question Duration is Not Positive.'};
  } else if (questionBody.duration + findQuiz.duration > 180) {
    return { error: 'Quiz Duration is Longer than 3 minutes.'};
  } else if (questionBody.points > 10 || questionBody.points < 1) {
    return { error: 'Quiz Points is Not Between 1 and 10.'};
  }
  for (let answer of questionBody.answers) {
    if (answer.answer.length > 30 || answer.answer.length < 1) {
      return { error: 'Question Answer Length is not Between 1 and 30.'};
    }
  }
  for (let i = 0; i < questionBody.answers.length; i++) {
    for (let j = i + 1; j < questionBody.answers.length; j++) {
      if (questionBody.answers[i].answer === questionBody.answers[j].answer) {
        return {error: 'There Are Duplicate '}
      }
    }
  }
  //Setting Up the Question and Answers to be Pushed Onto The Datastore
  let answerBody = [];
  for (let answer of questionBody.answers) {
    answerBody.push({
      answerId: counters.answerIdCounter,
      answer: answer.answer,
      colour: getRandomColour(),
      correct: answer.correct,
    })
  };
  counters.answerIdCounter++;

  let questionId = counters.questionIdCounter;

  findQuiz.questions.push({
    questionId: questionId,
    question: questionBody.question,
    duration: questionBody.duration,
    points: questionBody.points,
    answers: answerBody,
  })

  counters.questionIdCounter++;

  findQuiz.duration += questionBody.duration;
  findQuiz.timeLastEdited = date;

  return {
    questionId: questionId,
  }
}


function adminQuizTrashEmpty(token: string, quizIds: number[]): EmptyObject | ErrorObject {
  const data = getData();

  for (const trashQuizzes of data.trash) {
    const findIdInTrash = quizIds.find(paramQuizIds => paramQuizIds === trashQuizzes.quizId);
    if (!findIdInTrash) {
      return { error: 'One or more of the Quiz IDs is not currently in the trash' };
    }
  }

  const findToken = data.sessions.find(ids => ids.token === token);
  if (!findToken) {
    return { error: 'Token invalid' };
  }

  for (const userQuizIds of quizIds) {
    for (const trashQuizzes of data.trash) {
      if (userQuizIds === trashQuizzes.quizId) {
        if (findToken.userId !== trashQuizzes.authUserId) {
          return { error: 'a QuizId refers to a quiz that this current user does not own'}
        }
      }
    }
  }

  for (const userQuizIds of quizIds) {
    const findQuizIndex = data.trash.findIndex(trash => trash.quizId === userQuizIds);
    data.trash.splice(findQuizIndex, 1);
  }

}

function adminQuizQuestionDelete(token: string, quizId: number, questionId: number): ErrorObject | EmptyObject {
  const data = getData();
  const findToken = data.sessions.find(ids => ids.token === token);
  const findQuiz = data.quizzes.find(quiz => quiz.quizId === quizId);
  const findQuizIndex = data.quizzes.findIndex(quiz => quiz.quizId === quizId);

  //Error Checks for Token and QuizID
  if (!findToken) {
    return { error: 'Token invalid.'}
  }
  if (!findQuiz) {
    return { error: 'Quiz Id is invalid.'}
  }
  if (findQuiz.authUserId !== findToken.userId) {
    return { error: 'User does not own this quiz.' };
  }

  const findQuestionIndex = data.quizzes[findQuizIndex].questions.findIndex(question => question.questionId === questionId);

  if (findQuestionIndex === -1) {
    return { error: 'Question Invalid.' };
  }

  //Deleting the Question
  data.quizzes[findQuizIndex].questions.splice(findQuestionIndex, 1);

  return { };
}


export {
  adminQuizNameUpdate,
  adminQuizRemove,
  adminQuizList,
  adminQuizInfo,
  adminQuizCreate,
  adminQuizDescriptionUpdate,
  adminQuizQuestionDelete,
  adminQuizTransfer,
  adminQuizQuestionCreate,
  adminQuizTrashEmpty
};
