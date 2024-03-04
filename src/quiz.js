import { isAlpha } from 'validator'
import { getData, setData } from './dataStore.js'
let quizIdcounter = 0;
function adminQuizNameUpdate(authUserId, quizId, name) {
	return { } // Empty object
}

function adminQuizRemove(authUserId, quizId) {
	return { } // Empty object
}

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
	return {
		quizId: 1,
		name: 'My Quiz',
		timeCreated: 1683125870,
		timeLastEdited: 1683125871,
		description: 'This is my quiz',
	}
}

function adminQuizCreate(authUserId, name, description) {
	let newdata = getData();
	let userData = newdata.user;
	let searchUserId = userData.findIndex(Ids => Ids.userId === authUserId);
	let isAlphanumeric = /^[a-zA-Z0-9\s]+$/.test(name);

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
	})

	return {
		quizId: quizIdcounter,
	}
}

function adminQuizDescriptionUpdate(authUserId, quizId, description) {
	return { } //Empty Object
}

export {
	adminQuizNameUpdate,
	adminQuizRemove,
	adminQuizList,
	adminQuizInfo,
	adminQuizCreate,
	adminQuizDescriptionUpdate,
}