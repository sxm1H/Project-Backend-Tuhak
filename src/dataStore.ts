// YOU SHOULD MODIFY THIS OBJECT BELOW ONLY
import {
  DataStore,
} from './interfaces';
import request, { HttpVerb } from 'sync-request';

const DEPLOYED_URL = 'https://1531-24t1-f13b-dream.vercel.app';

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

// YOU SHOULD MODIFY THIS OBJECT ABOVE ONLY

// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

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

const getData = (): DataStore => {
  try {
    const res = requestHelper('GET', '/data', {});
    return res.data;
  } catch (e) {
    return {
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
  }
};

const setData = (newData: DataStore) => {
  requestHelper('PUT', '/data', { data: newData });
};

// Use get() to access the data
// function getData(): DataStore {
//   return data;
// }

// // Use set(newData) to pass in the entire data object, with modifications made
// function setData(newData: DataStore): void {
//   data = newData;
// }

export {
  getData,
  setData,
  // counters,
  // getCounters,
  // setCounters
};
