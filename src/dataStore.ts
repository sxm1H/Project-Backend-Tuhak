// YOU SHOULD MODIFY THIS OBJECT BELOW ONLY
import {
  Counters,
  DataStore,
} from './interfaces';

let data: DataStore = {
  user: [],
  quizzes: [],
  sessions: [],
  trash: [],
  quizActiveState: [],
  quizInactiveState: [],
  sessionIdCounter: 10000,
  answerIdCounter: 0,
  questionIdCounter: 0,
  quizIdCounter: 0
};

// let counters: Counters = {
//   sessionIdCounter: 10000,
//   answerIdCounter: 0,
//   questionIdCounter: 0,
//   quizIdCounter: 0
// };

// YOU SHOULD MODIFY THIS OBJECT ABOVE ONLY

// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

/*
Example usage
    let store = getData()
    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

    names = store.names

    names.pop()
    names.push('Jake')

    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
    setData(store)
*/

const requestHelper = (method: HttpVerb, path: string, payload: object) => {
  let json = {};
  let qs = {};
  if (['POST', 'DELETE'].includes(method)) {
    qs = payload;
  } else {
    json = payload;
  }

  const res = request(method, DEPLOYED_URL + path, { qs, json, timeout: 20000 });
  return JSON.parse(res.body.toString());
};

const getData = (): Data => {
  try {
    const res = requestHelper('GET', '/data', {});
    return res.data;
  } catch (e) {
    return {
      names: []
    };
  }
};

export const setData = (newData: Data) => {
  requestHelper('PUT', '/data', { data: newData });
};


// Use get() to access the data
// function getData(): DataStore {
//   return data;
// }

// // function getCounters(): Counters {
// //   return counters;
// // }

// // Use set(newData) to pass in the entire data object, with modifications made
// function setData(newData: DataStore): void {
//   data = newData;
// }

// function setCounters(newCounters: Counters): void {
//   counters = newCounters;
// }
export {
  getData,
  setData,
  // counters,
  // getCounters,
  // setCounters
};
