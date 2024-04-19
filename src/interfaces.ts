// interface Counters {
//   sessionIdCounter: number;
//   answerIdCounter: number;
//   questionIdCounter: number;
//   quizIdCounter: number;
// }

interface DataStore {
  user: User[];
  quizzes: Quiz[];
  sessions: Sessions[];
  trash: Quiz[];
  quizActiveState: quizState[];
  quizInactiveState: quizState[];
  sessionIdCounter: number;
  answerIdCounter: number;
  questionIdCounter: number;
  quizIdCounter: number;
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
}

interface Player {
  name: string;
  playerId: number;
  questions: answeredQuestion[];
  rank: number[];
  scorePer: number[];
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
  authUserId?: number;
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

interface PlayerId {
  playerId: number;
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
  thumbnailUrl?: string;
}

interface QuestionResultsReturn {
  questionId: number;
  playersCorrectList: string[];
  averageAnswerTime: number;
  percentageCorrect: number;
}

interface QuizId {
  quizId: number;
}

interface DuplicateQuestionReturn {
  newQuestionId: number;
}

interface ChatReturn {
  messages: Message[];
}

interface SessionIdReturn {
  sessionId: number;
}

interface QuizSessionReturn {
  activeSessions: number[];
  inactiveSessions: number[];
}

interface SessionStatusReturn {
  state: string;
  atQuestion: number;
  players: string[];
  metadata: Quiz;
}

interface UserRanks {
  name: string;
  score: number;
}

interface FinalScoreReturn {
  usersRankedByScore: UserRanks[];
  questionResults: QuestionResultsReturn[];
}

interface QuizPlayerReturn {
  state: string;
  numQuestions: number;
  atQuestion: number;
}

interface RequestHelperReturnType {
  token?: string;
  error?: string;
  quizzes?: QuizListInfo[];
  quizId?: number;
  name?: string;
  timeCreated?: number;
  timeLastEdited?: number;
  description?: string;
  numQuestions?: number;
  duration?: number;
  questions?: Question[];
  questionId?: number;
  newQuestionId?: number;
  sessionId?: number;
  playerId?: number;
  thumbnailUrl?: string;
  activeSessions?: number[];
  inactiveSessions?: number[];
  state?: string;
  atQuestion?: number;
  players?: Player[];
  metadata?: Quiz;
  messageBody?: string;
  playerName?: string;
  timeSent?: number;
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
  QuizTrashReturnObject,
  QuestionId,
  DuplicateQuestionReturn,
  States,
  Actions,
  quizState,
  Player,
  QuestionResultsReturn,
  PlayerId,
  ChatReturn,
  SessionIdReturn,
  QuizSessionReturn,
  SessionStatusReturn,
  FinalScoreReturn,
  QuizPlayerReturn,
  RequestHelperReturnType
};
