import request, { HttpVerb } from 'sync-request-curl';
import { port, url } from '../config.json';
import { Answer } from '../interfaces';
import HTTPError from 'http-errors';

const SERVER_URL = `${url}:${port}`;
const TIMEOUT_MS = 20000;

// The 'RequestHelperReturnType' inteface and 'requestHelper' have been referenced from the file
// 'wrapper.test.ts' in the week5-server-example respository.
const requestHelper = (
  method: HttpVerb,
  path: string,
  payload: object = {}
): any => {
  let qs = {};
  let json = {};
  if (['GET', 'DELETE'].includes(method)) {
    qs = payload;
  } else {
    // PUT/POST
    json = payload;
  }
  const res = request(method, SERVER_URL + path, { qs, json, timeout: TIMEOUT_MS });

  let responseBody: any;
  try {
    responseBody = JSON.parse(res.body.toString());
  } catch (err: any) {
    if (res.statusCode === 200) {
      throw HTTPError(500,
        `Non-jsonifiable body despite code 200: '${res.body}'.\n
        Check that you are not doing res.json(undefined) instead of res.json({}), e.g. in '/clear'`
      );
    }
    responseBody = { error: `Failed to parse JSON: '${err.message}'` };
  }

  const errorMessage = `[${res.statusCode}] ` + responseBody?.error || responseBody || 'No message specified!';

  // NOTE: the error is rethrown in the test below. This is useful becasuse the
  // test suite will halt (stop) if there's an error, rather than carry on and
  // potentially failing on a different expect statement without useful outputs
  switch (res.statusCode) {
    case 400: // BAD_REQUEST
    case 401: // UNAUTHORIZED
      throw HTTPError(res.statusCode, errorMessage);
    case 404: // NOT_FOUND
      throw HTTPError(res.statusCode, `Cannot find '${url}' [${method}]\nReason: ${errorMessage}\n\n
      Hint: Check that your server.ts have the correct path AND method`);
    case 500: // INTERNAL_SERVER_ERROR
      throw HTTPError(res.statusCode, errorMessage + '\n\nHint: Your server crashed. Check the server log!\n');
    default:
      if (res.statusCode !== 200) {
        throw HTTPError(res.statusCode, errorMessage + `\n\n
        Sorry, no idea! Look up the status code ${res.statusCode} online!\n`);
      }
  }
  return responseBody;
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
const adminQuizQuestionUpdate = (question: string, duration: number, points: number, answers: Answer[], token: string, quizId: number, questionId: number) => {
  const questionBody = {
    question: question,
    duration: duration,
    points: points,
    answers: answers,
  };
  return requestHelper('PUT', `/v1/admin/quiz/${quizId}/question/${questionId}`, { questionBody, token });
};
const adminQuizInfo = (token: string, quizId: number) => {
  return requestHelper('GET', `/v1/admin/quiz/${quizId}`, { token, quizId });
};

const adminQuizTrashView = (token: string) => {
  return requestHelper('GET', '/v1/admin/quiz/trash', { token });
};

const adminQuizNameUpdate = (token: string, quizId: number, name: string) => {
  return requestHelper('PUT', `/v1/admin/quiz/${quizId}/name`, { token, quizId, name });
};

const adminQuizDescriptionUpdate = (token: string, quizId: number, description: string) => {
  return requestHelper('PUT', `/v1/admin/quiz/${quizId}/description`, { token, quizId, description });
};

const adminQuizQuestionMove = (quizid: number, questionid: number, token: string, newPosition: number) => {
  return requestHelper('PUT', `/v1/admin/quiz/${quizid}/question/${questionid}/move`, { token, newPosition });
};

const adminQuizQuestionCreate = (quizId: number, token: string, question: string, duration: number, points: number, answers: Answer[]) => {
  const questionBody = {
    question: question,
    duration: duration,
    points: points,
    answers: answers,
  };

  return requestHelper('POST', `/v1/admin/quiz/${quizId}/question`, { token, questionBody });
};

const adminAuthLogout = (token: string) => {
  return requestHelper('POST', '/v1/admin/auth/logout', { token });
};

const adminQuizQuestionDelete = (token: string, quizId: number, questionId: number) => {
  return requestHelper('DELETE', `/v1/admin/quiz/${quizId}/question/${questionId}`, { token });
};

const adminQuizTransfer = (token: string, userEmail: string, quizId: number) => {
  return requestHelper('POST', `/v1/admin/quiz/${quizId}/transfer`, { token, userEmail });
};

const adminQuizTrashEmpty = (token: string, quizIds: string) => {
  return requestHelper('DELETE', '/v1/admin/quiz/trash/empty', { token, quizIds });
};

const adminQuizQuestionDuplicate = (token: string, quizId: number, questionId: number) => {
  return requestHelper('POST', `/v1/admin/quiz/${quizId}/question/${questionId}/duplicate`, { token });
};

const adminQuizRestore = (token: string, quizId: number) => {
  return requestHelper('POST', `/v1/admin/quiz/${quizId}/restore`, { token, quizId });
};

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
  adminQuizQuestionMove,
  adminAuthLogout,
  adminQuizQuestionDelete,
  adminQuizTransfer,
  adminQuizQuestionCreate,
  adminQuizQuestionDuplicate,
  adminQuizTrashView,
  adminQuizTrashEmpty,
  adminQuizQuestionUpdate,
  adminQuizRestore
};
