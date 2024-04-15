import { getData, counters } from './dataStore';
import {
  ErrorObject,
  TokenReturn,
  UserDetailsReturnObject,
  UserData,
  States,
  Actions,
  quizState,
  Player,
  QuizId
} from './interfaces';
import HTTPError from 'http-errors';

function adminQuizSessionCreate(token: string, quizId: number, autoStartNum: number) {
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

  return { sessionId: newSessionId };
}

function adminQuizSessionUpdate(token: string, quizId: number, sessionId: number, action: string) {
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
      findSession.timeoutId = setTimeout(quizWaitThreeHelper, 3 * 1000, findSession);
    } else if (action === Actions.END) {
      findSession.state = States.END;
    } else {
      throw HTTPError(400, 'Action enum cannot be applied in the current state');
    }
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

  return {};
}

function adminQuizSessionJoin(sessionId: number, name: string) {
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
    score: 0
  });

  return { playerId: playerId };
}

function adminQuizPlayerSubmitAnswer (answerIds: number[], playerid: number, questionposition: number) {
  // const data = getData();

  // // Double for loop, to iterate through two arrays.

  // // session thingo might not work

  // let session: quizState | undefined;
  // let findPlayer: Player;
  // for (const sessions of data.quizActiveState) {
  //   for (const players of sessions.players) {
  //     if (players.playerId === playerid) {
  //       findPlayer = players;
  //       session = sessions;
  //     }
  //   }
  // }

  // if (session === undefined) {
  //   throw HTTPError(400, 'player ID does not exist');
  // }

  // if (session.state !== States.QUESTION_OPEN) {
  //   throw HTTPError(400, 'Session is not in QUESTION_OPEN state');
  // }

  // if (questionposition > session.metadata.numQuestions) {
  //   throw HTTPError(400, 'question position is not valid for the session this player is in');
  // }

  // if (questionposition !== session.atQuestion) {
  //   throw HTTPError(400, 'session is not yet up to this question');
  // }

  // if (answerIds.length < 1) {
  //   throw HTTPError(400, 'Less than 1 answer ID was submitted');
  // }

  // const possibleAnswers = session.metadata.questions[session.atQuestion - 1].answers;
  
  // let counter = 0;
  
  // for (const answer of answerIds) {
  //   let findAnswer = possibleAnswers.find(answers => answers.answerId === answer);
  //   if (!findAnswer) {
  //     throw HTTPError(400, 'Answer IDs are not valid for this particular question');
  //   }
  //   if (findAnswer.correct === true) {
  //     counter++;
  //   }
  // };

  // const findQuestion = findPlayer.questions[questionposition - 1];

  // if (counter === answerIds.length) {
  //   findQuestion.isCorrect === true;
  // }

  // let timeEnd = Math.floor(Date.now() / 1000);

  // findQuestion.timeEnd = timeEnd;
  // findQuestion.timeTaken = timeEnd - findQuestion.timeStart;
  // findQuestion.answers = answerIds;

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
 * @return {object {error: string}} - returns an error string if an the correct error
 * is encountered
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

  counters.quizIdCounter++;
  newdata.quizzes.push({
    quizId: counters.quizIdCounter,
    name: name,
    description: description,
    authUserId: authUserId,
    timeCreated: date,
    timeLastEdited: date,
    numQuestions: 0,
    questions: [],
    duration: 0,
    thumbnailUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu1V5-mUs0C8qTExeBmjUv1J_gUBGvFludmgUw2Kfwxw&s'
  });

  return { quizId: counters.quizIdCounter };
}

function v2adminQuizRemove(token: string, quizId: number) {
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
  
  return {};
}

function v2adminQuizTransfer(token: string, userEmail: string, quizId: number) {
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

  return {};
}

/// HELPER FUNCTIONS

function generateRandomName() {
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

function quizWaitThreeHelper (session: quizState) {
  session.timeoutId = undefined;
  quizSkipCountdownHelper(session);
}

function quizSkipCountdownHelper (session: quizState) {
  session.state = States.QUESTION_OPEN;
  session.atQuestion++;

  clearTimeoutId(session);

  const duration = session.metadata.questions[session.atQuestion - 1].duration;

  setTimeout(quizOpenQuestionDurationHelper, duration, session);

  for (const player of session.players) {
    player.questions.push({
      questionId: session.metadata.questions[session.atQuestion - 1].questionId,
      timeStart: Math.floor(Date.now() / 1000),
      timeEnd: Math.floor(Date.now() + duration),
      timeTaken: duration,
      isCorrect: false,
      answers: [],
    })
  }
}

function quizOpenQuestionDurationHelper (session: quizState) {
  session.state = States.QUESTION_CLOSE;
  session.timeoutId = undefined;
}


function clearTimeoutId (session: quizState) {
  if (session.timeoutId !== undefined) {
    clearTimeout(session.timeoutId);
    session.timeoutId = undefined;
  }
}

function quizCountdownHelper (session: quizState, action: string) {
  if (action === Actions.SKIP_COUNTDOWN) {
    quizSkipCountdownHelper(session);
  } else if (action === Actions.END) {
    session.state = States.END;
    clearTimeoutId(session);
  } else {
    throw HTTPError(400, 'Action enum cannot be applied in the current state');
  }
  return {};
}

function quizOpenHelper (session: quizState, action: string) {
  if (action === Actions.GO_TO_ANSWER) {
    clearTimeoutId(session);
    session.state = States.ANSWER_SHOW;
  } else if (action === Actions.END) {
    clearTimeoutId(session);
    session.state = States.END;
  } else {
    // Finds the duration of the questions it's currently at, and waits that long till switching
    // state
    throw HTTPError(400, 'Action enum cannot be applied in the current state');
  }
  return {};
}

function quizCloseHelper (session: quizState, action: string) {
  if (action === Actions.GO_TO_ANSWER) {
    session.state = States.ANSWER_SHOW;
  } else if (action === Actions.END) {
    session.state = States.END;
  } else if (action === Actions.NEXT_QUESTION) {
    session.state = States.QUESTION_COUNTDOWN;
    session.timeoutId = setTimeout(quizWaitThreeHelper, 3 * 1000, session);
  } else if (action === Actions.GO_TO_FINAL_RESULTS) {
    session.state = States.FINAL_RESULTS;
  } else {
    throw HTTPError(400, 'Action enum cannot be applied in the current state');
  }
  return {};
}

function quizShowHelper (session: quizState, action: string) {
  if (action === Actions.NEXT_QUESTION) {
    session.state = States.QUESTION_COUNTDOWN;
    session.timeoutId = setTimeout(quizWaitThreeHelper, 3 * 1000, session);
  } else if (action === Actions.GO_TO_FINAL_RESULTS) {
    session.state = States.FINAL_RESULTS;
  } else if (action === Actions.END) {
    session.state = States.END;
  } else {
    throw HTTPError(400, 'Action enum cannot be applied in the current state');
  }
  return {};
}

function quizFinalHelper (session: quizState, action: string) {
  if (action === Actions.END) {
    session.state = States.END;
  } else {
    throw HTTPError(400, 'Action enum cannot be applied in the current state');
  }
}

export {
  adminQuizSessionCreate,
  adminQuizSessionUpdate,
  adminQuizPlayerSubmitAnswer,
  adminQuizSessionJoin,
  v2adminQuizRemove,
  v2adminQuizTransfer,
  v2adminQuizCreate
};
