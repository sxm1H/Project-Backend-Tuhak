// YOU SHOULD MODIFY THIS OBJECT BELOW ONLY
interface Counters {
  sessionIdCounter: number;
  answerIdCounter: number;
  questionIdCounter: number;
  quizIdCounter: number;
}

interface DataStore {
  user: User[];
  quizzes: Quiz[];
  sessions: Sessions[];
  trash: Quiz[];
}

interface User {
  email: string;
  password: string;
  nameFirst: string;
  nameLast: string;
  userId: number;
  passwordHistory: string[];
  numSuccessfulLogins: number;
  numFailedPasswordsSinceLastLogin: number;
}

interface Quiz {
  quizId: number;
  name: string;
  description: string;
  authUserId: number;
  timeCreated: number;
  timeLastEdited: number;
  numQuestions: number;
  questions: Question[];
  duration: number;
}

export interface Question {
  questionId?: number;
  question: string;
  duration: number;
  points: number;
  answers: Answer[];
}

export interface Answer {
  answerId?: number;
  answer: string;
  colour?: string;
  correct: boolean;
}

interface Sessions {
  userId: number;
  token: string;
}

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
}

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
