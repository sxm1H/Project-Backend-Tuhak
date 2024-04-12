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

interface Question {
  questionId?: number;
  question: string;
  duration: number;
  points: number;
  answers: Answer[];
}

interface Answer {
  answerId?: number;
  answer: string;
  colour?: string;
  correct: boolean;
}

interface Sessions {
  userId: number;
  token: string;
}

interface ErrorObject {
  error: string;
}

interface AdminId {
  authUserId: number;
}

interface TokenReturn {
  token: string;
}

interface QuestionId {
  questionId: number;
}

interface UserDetails {
  userId: number;
  name: string;
  email: string;
  numSuccessfulLogins: number;
  numFailedPasswordsSinceLastLogin: number;
}

interface UserDetailsReturnObject {
  user: UserDetails;
}

interface UserData {
  email: string;
  password: string;
  nameFirst: string;
  nameLast: string;
  userId: number;
  passwordHistory: string[];
  numSuccessfulLogins: number;
  numFailedPasswordsSinceLastLogin: number;
}

interface QuizListReturnObject {
  quizzes: QuizListInfo[];
}

interface QuizTrashReturnObject {
  quizzes: QuizListInfo[];
}

interface QuizListInfo {
  quizId: number;
  name: string;
}

interface QuizInfoReturn {
  quizId: number;
  name: string;
  timeCreated: number;
  timeLastEdited: number;
  description: string;
  numQuestions: number;
  questions: Question[],
  duration: number;
}

interface QuizId {
  quizId: number;
}

interface RequestHelperReturnType {
  statusCode: number;
  jsonBody?: Record<string, never>;
  error?: string;
}

interface DuplicateQuestionReturn {
  newQuestionId: number;
}

export {
  Counters,
  DataStore,
  User,
  Quiz,
  Question,
  Answer,
  Sessions,
  ErrorObject,
  AdminId,
  TokenReturn,
  UserDetails,
  UserDetailsReturnObject,
  UserData,
  QuizListReturnObject,
  QuizListInfo,
  QuizInfoReturn,
  QuizId,
  RequestHelperReturnType,
  QuizTrashReturnObject,
  QuestionId,
  DuplicateQuestionReturn,
};
