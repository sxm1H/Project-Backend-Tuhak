// YOU SHOULD MODIFY THIS OBJECT BELOW ONLY
import {
  Counters,
  DataStore,
} from './iter2Interfaces';

let data: DataStore = {
  user: [],
  quizzes: [],
  sessions: [],
  trash: [],
};

let counters: Counters = {
  sessionIdCounter: 10000,
  answerIdCounter: 0,
  questionIdCounter: 0,
  quizIdCounter: 0
};

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

// Use get() to access the data
function getData(): DataStore {
  return data;
}

function getCounters(): Counters {
  return counters;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData: DataStore): void {
  data = newData;
}

function setCounters(newCounters: Counters): void {
  counters = newCounters;
}
export {
  getData,
  setData,
  counters,
  getCounters,
  setCounters
};
