import request, { HttpVerb } from 'sync-request-curl';
import { port, url } from './config.json';
import { Answer } from './dataStore';

const SERVER_URL = `${url}:${port}`;

// The 'RequestHelperReturnType' inteface and 'requestHelper' have been referenced from the file
// 'wrapper.test.ts' in the week5-server-example respository.
interface RequestHelperReturnType {
    statusCode: number;
    jsonBody?: Record<string, any>;
    error?: string;
}

const requestHelper = (
  method: HttpVerb,
  path: string,
  payload: object = {}
): RequestHelperReturnType => {
  let qs = {};
  let json = {};
  if (['GET', 'DELETE'].includes(method)) {
    qs = payload;
  } else {
    // PUT/POST
    json = payload;
  }
  const res = request(method, SERVER_URL + path, { qs, json, timeout: 20000 });
  const bodyString = res.body.toString();
  let bodyObject: RequestHelperReturnType;
  try {
    // Return if valid JSON, in our own custom format
    bodyObject = {
      jsonBody: JSON.parse(bodyString),
      statusCode: res.statusCode,
    };
  } catch (error: any) {
    bodyObject = {
      error: `\
  Server responded with ${res.statusCode}, but body is not JSON!
  
  GIVEN:
  ${bodyString}.
  
  REASON:
  ${error.message}.
  
  HINT:
  Did you res.json(undefined)?`,
      statusCode: res.statusCode,
    };
  }
  if ('error' in bodyObject) {
    // Return the error in a custom structure for testing later
    return { statusCode: res.statusCode, error: bodyObject.error };
  }
  return bodyObject;
};

/// ////////////////////////////////////WRAPPER FUNCTIONS////////////////////////////////////////////
// ============================================================================================== //

const clear = () => {
  return requestHelper('DELETE', '/v1/clear');
};

const adminAuthRegister = (email: string, password: string, nameFirst: string, nameLast: string) => {
  return requestHelper('POST', '/v1/admin/auth/register', { email, password, nameFirst, nameLast });
};

const adminAuthLogin = (email: string, password: string) => {
  return requestHelper('POST', '/v1/admin/auth/login', { email, password });
};

const adminUserDetails = (token: string) => {
  return requestHelper('GET', '/v1/admin/user/details', { token });
};

const adminUserDetailsUpdate = (token: string, email: string, nameFirst: string, nameLast: string) => {
  return requestHelper('PUT', '/v1/admin/user/details', { token, email, nameFirst, nameLast });
};

const adminUserPasswordUpdate = (token: string, oldPassword: string, newPassword: string) => {
  return requestHelper('PUT', '/v1/admin/user/password', { token, oldPassword, newPassword });
};

const adminQuizList = (token: string) => {
  return requestHelper('GET', '/v1/admin/quiz/list', { token });
};

const adminQuizCreate = (token: string, name: string, description: string) => {
  return requestHelper('POST', '/v1/admin/quiz', { token, name, description });
};

const adminQuizRemove = (token: string, quizId: number) => {
  return requestHelper('DELETE', `/v1/admin/quiz/${quizId}`, { token, quizId });
};

const adminQuizInfo = (token: string, quizId: number) => {
  return requestHelper('GET', `/v1/admin/quiz/${quizId}`, { token, quizId });
};

const adminQuizNameUpdate = (token: string, quizId: number, name: string) => {
  return requestHelper('PUT', `/v1/admin/quiz/${quizId}/name`, { token, quizId, name });
};

const adminQuizDescriptionUpdate = (token: string, quizId: number, description: string) => {
  return requestHelper('PUT', `/v1/admin/quiz/${quizId}/description`, { token, quizId, description });
};

const adminQuizQuestionCreate = (quizId: number, token: string, question: string, duration: number, points: number, answers: Answer[]) => {
  let questionBody = {
    questionBody: {
      question: question,
      duration: duration,
      points: points,
      answers: answers,
    }
  };
  return requestHelper('POST', `/v1/admin/quiz/${quizId}/question`, { token, questionBody });
}

const adminAuthLogout = (token: string) => {
  return requestHelper('POST', '/v1/admin/auth/logout', { token } );
};

const adminQuizQuestionDelete = (token: string, quizId: number, questionId: number) => {
  return requestHelper('DELETE', `/v1/admin/quiz/${quizId}/question/${questionId}`, { token });
}

// ============================================================================================== //

export {
  requestHelper,
  clear,
  adminAuthRegister,
  adminAuthLogin,
  adminUserDetails,
  adminUserDetailsUpdate,
  adminUserPasswordUpdate,
  adminQuizList,
  adminQuizCreate,
  adminQuizRemove,
  adminQuizInfo,
  adminQuizNameUpdate,
  adminQuizDescriptionUpdate,
  adminQuizQuestionCreate,
  adminAuthLogout,
  adminQuizQuestionDelete,
};
