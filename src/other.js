import { getData, setData } from './dataStore.js'

function clear() {

    let data = getData();

    setData({
        user: [],
        quizzes: [],
    });

    data = getData();

    return {

    }
}

export { clear };

