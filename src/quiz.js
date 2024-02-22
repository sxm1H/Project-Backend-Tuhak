function adminQuizNameUpdate(authUserId, quizId, name) {
    return { } // Empty object
    }

function adminQuizRemove(authUserId, quizId) {
    return { } // Empty object
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
    return {
        quizId: 2,
    }
}