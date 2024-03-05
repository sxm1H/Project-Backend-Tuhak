import { getData, setData } from './dataStore.js'

function clear() {

    setData({
        user: [],
        quizzes: [],
    });

    return {}
}

export { clear };

