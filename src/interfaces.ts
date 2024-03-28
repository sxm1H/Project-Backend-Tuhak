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
import {
  Question,
} from './dataStore';
