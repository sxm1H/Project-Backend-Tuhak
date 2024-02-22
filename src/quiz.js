function adminQuizNameUpdate(authUserId, quizId, name) {
    return { } // Empty object
    }

function adminQuizRemove(authUserId, quizId) {
    return { } // Empty object
}

function adminQuizList(authUserId) {
    return {
        quizzes: [
            {
                quizId: 1,
                name: 'My Quiz',
            }
        ]
    }
}