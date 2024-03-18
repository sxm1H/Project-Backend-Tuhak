interface ErrorObject {
  error: string;
}

interface EmptyObject {

}

interface AdminId {
  authUserId: number;
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
}

interface QuizId {
  quizId: number;
}

export {
  ErrorObject,
  EmptyObject,
  AdminId,
  UserDetails,
  UserDetailsReturnObject,
  UserData,
  QuizListReturnObject,
  QuizListInfo,
  QuizInfoReturn,
  QuizId
}