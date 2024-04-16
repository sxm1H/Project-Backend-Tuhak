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
  quizActiveState: quizState[];
  quizInactiveState: quizState[];
}

interface answeredQuestion {
  questionId: number | undefined;
  timeStart: number;
  timeEnd: number;
  timeTaken: number;
  isCorrect: boolean;
  answers: number[];
}

interface quizState {
  metadata: Quiz;
  sessionId: number;
  state: string;
  atQuestion: number;
  players: Player[];
  autoStartNum: number;
  messages: Message[];
  timeoutId?: ReturnType<typeof setTimeout>;
}

interface Player {
  name: string;
  playerId: number;
  questions: answeredQuestion[];
  score: number;
}

interface Message {
  messageBody: string;
  playerId: number;
  playerName: string;
  timeSent: number;
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
  thumbnailUrl?: string;
}

interface Question {
  questionId?: number;
  question: string;
  duration: number;
  points: number;
  answers: Answer[];
  thumbnailUrl?: string;
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

interface newQuizInfoReturn {
  quizId: number;
  name: string;
  timeCreated: number;
  timeLastEdited: number;
  description: string;
  numQuestions: number;
  questions: Question[],
  duration: number;
  thumbnailUrl: string;
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

enum States {
  LOBBY = 'LOBBY',
  QUESTION_COUNTDOWN = 'QUESTION_COUNTDOWN',
  QUESTION_OPEN = 'QUESTION_OPEN',
  QUESTION_CLOSE = 'QUESTION_CLOSE',
  ANSWER_SHOW = 'ANSWER_SHOW',
  FINAL_RESULTS = 'FINAL_RESULTS',
  END = 'END'
}

enum Actions {
  NEXT_QUESTION = 'NEXT_QUESTION',
  SKIP_COUNTDOWN = 'SKIP_COUNTDOWN',
  GO_TO_ANSWER = 'GO_TO_ANSWER',
  GO_TO_FINAL_RESULTS = 'GO_TO_FINAL_RESULTS',
  END = 'END',
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
  States,
  Actions,
  quizState,
  Player,
  newQuizInfoReturn,
};
