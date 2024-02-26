import { getData, setData } from './dataStore.js'

function clear() {

    let data = getData();

    console.log(data);

    setData({
        user: [],
        quizzes: [],
    });

    data = getData();

    console.log(data);

    return {

    }
}

clear();

export { clear };

