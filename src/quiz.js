import { isAlpha } from 'validator'
import { getData, setData } from './dataStore.js'
let quizIdcounter = 0;


function adminQuizNameUpdate(authUserId, quizId, name) {

	let newdata = getData();
	let userData = newdata.user;
	let searchUserId = userData.findIndex(Ids => Ids.userId === authUserId);
	let isAlphanumeric = /^[a-zA-Z0-9 ]+$/.test(name);
	let date = Date.now();

	if (searchUserId === -1) {
		return {error: 'User Id is not valid'};
	};

	if (!isAlphanumeric) {
		return {error: 'Quiz Name contains invalid characters',}
	};

	if (name.length < 3 || name.length > 30 ) {
		return {error: 'Quiz Name must be more than 2 chracters and less than 31 characters long'}
	};

	let courseData = newdata.quizzes;

	for (let i of courseData) {
		if (i.authUserId === authUserId) {
			if (i.name === name) {
				return {error: 'Quiz name already in use'}
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
		}
	}

	return { } // Empty object
}

function adminQuizRemove(authUserId, quizId) {

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
		}
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
		}
	}

	return { } // Empty object
}

/**
 * The function will return a list of quizes in the datastore containing information about 
 * its quizId and its name, given a valid User Id.
 * It should return an error if the user Id is not valid.
 * @param {Int} authUserId - the user Id created from adminAuthRegister
 * @return {string} - If an error is occurs, it will return an error object with a string
 * @return {Object: Array} - an Array of quizzes ojects that have quizId and name
 * 
 */

function adminQuizList(authUserId) {
  let newdata = getData()
  let serachUserId = newdata.user.findIndex(ids => ids.userId === authUserId);
  
  if (serachUserId === -1) {
    return {
      error: 'invalid user Id'
    }
  }

  let quizList =  newdata.quizzes.map(quizes => ({
    quizId: quizes.quizId,
    name: quizes.name,
  }))

	return {
		quizzes: quizList
	}
}

function adminQuizInfo(authUserId, quizId) {
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
	}
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
 * @return {object: int} - returns a quiz Id object that contains the unique quiz Id relating
 * to the created quiz.
 */

function adminQuizCreate(authUserId, name, description) {
	let newdata = getData();
	let userData = newdata.user;
	let searchUserId = userData.findIndex(Ids => Ids.userId === authUserId);
	let isAlphanumeric = /^[a-zA-Z0-9 ]+$/.test(name);
	let date = Date.now();

	if (searchUserId === -1) {
		return {error: 'User Id is not valid'};
	};

	if (!isAlphanumeric) {
		return {error: 'Quiz Name contains invalid characters',}
	};

	if (name.length < 3 || name.length > 30 ) {
		return {error: 'Quiz Name must be more than 2 chracters and less than 31 characters long'}
	};

	let courseData = newdata.quizzes;

	for (let i of courseData) {
		if (i.authUserId === authUserId) {
			if (i.name === name) {
				return {error: 'Quiz name already in use'}
			}
		}
	}

	if (description.length > 100) {
		return {error: 'Description is more than 100 characters'}
	};

	quizIdcounter++;
	newdata.quizzes.push({
		quizId: quizIdcounter,
		name: name,
		description: description,
		authUserId: authUserId,
		timeCreated: date,
		timeLastEdited: date,
	})

	return {
		quizId: quizIdcounter,
	}
}

function adminQuizDescriptionUpdate(authUserId, quizId, description) {
	let data = getData();
	if (authUserId < 1 || authUserId > data.user.length) {
		return {
			error: 'Auth User ID invalid'
		}
	}

	let quizInfo = false;

	for (let i = 0; i < data.quizzes.length; i++) {
		if (data.quizzes[i].quizId === quizId) {
			quizInfo = data.quizzes[i];
			if (quizInfo.authUserId !== authUserId) {
				return { error: 'Quiz Does Not Belong to User' }
			}
		}
	}

	if (quizInfo === false) {
		return { error: 'Quiz ID Invalid' };
	}

	if (description.length > 100) {
		return { error: 'Description Too Long' };
	} else {
		quizInfo.description = description;
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
}

