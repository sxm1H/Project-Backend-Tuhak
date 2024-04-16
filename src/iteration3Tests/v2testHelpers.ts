import request, { HttpVerb } from 'sync-request-curl';
import { port, url } from '../config.json';
import { Answer } from '../interfaces';
import { IncomingHttpHeaders } from 'http';
import HTTPError from 'http-errors';

const SERVER_URL = `${url}:${port}`;
const TIMEOUT_MS = 20000;

// This 'requestHelper' function has been referenced from quiz.test.ts from lab08_quiz.
const requestHelper = (
  method: HttpVerb,
  path: string,
  payload: object = {},
  headers: IncomingHttpHeaders = {}
): any => {
  let qs = {};
  let json = {};
  if (['GET', 'DELETE'].includes(method.toUpperCase())) {
    qs = payload;
  } else {
    // PUT/POST
    json = payload;
  }

  const url = SERVER_URL + path;
  const res = request(method, url, { qs, json, headers, timeout: TIMEOUT_MS });

  let responseBody: any;
  try {
    responseBody = JSON.parse(res.body.toString());
  } catch (err: any) {
    if (res.statusCode === 200) {
      throw HTTPError(500,
        `Non-jsonifiable body despite code 200: '${res.body}'.\nCheck that you are not doing res.json(undefined) instead of res.json({}), e.g. in '/clear'`
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
      throw HTTPError(res.statusCode, `Cannot find '${url}' [${method}]\nReason: ${errorMessage}\n\nHint: Check that your server.ts have the correct path AND method`);
    case 500: // INTERNAL_SERVER_ERROR
      throw HTTPError(res.statusCode, errorMessage + '\n\nHint: Your server crashed. Check the server log!\n');
    default:
      if (res.statusCode !== 200) {
        throw HTTPError(res.statusCode, errorMessage + `\n\nSorry, no idea! Look up the status code ${res.statusCode} online!\n`);
      }
  }
  return responseBody;
};

/// ////////////////////////////////////WRAPPER FUNCTIONS////////////////////////////////////////////
// ============================================================================================== //

const adminUserDetails = (token: string) => {
  return requestHelper('GET', '/v2/admin/user/details', {}, { token });
};

const adminUserDetailsUpdate = (token: string, email: string, nameFirst: string, nameLast: string) => {
  return requestHelper('PUT', '/v2/admin/user/details', { email, nameFirst, nameLast }, { token });
};

const adminUserPasswordUpdate = (token: string, oldPassword: string, newPassword: string) => {
  return requestHelper('PUT', '/v2/admin/user/password', { oldPassword, newPassword }, { token });
};

const adminQuizList = (token: string) => {
  return requestHelper('GET', '/v2/admin/quiz/list', {}, { token });
};

const v2adminQuizCreate = (token: string, name: string, description: string) => {
  return requestHelper('POST', '/v2/admin/quiz', { name, description }, { token });
};

const v2adminQuizRemove = (token: string, quizId: number) => {
  return requestHelper('DELETE', `/v2/admin/quiz/${quizId}`, { quizId }, { token });
};

// const v2adminQuizQuestionUpdate = (question: string, duration: number, points: number, answers: Answer[], token: string, quizId: number, questionId: number) => {
//   const questionBody = {
//     question: question,
//     duration: duration,
//     points: points,
//     answers: answers,
//   };
//   return requestHelper('PUT', `/v2/admin/quiz/${quizId}/question/${questionId}`, { questionBody, token });
// };

// const v2adminQuizInfo = (token: string, quizId: number) => {
//   return requestHelper('GET', `/v2/admin/quiz/${quizId}`, { quizId }, { token });
// };

const adminQuizTrashView = (token: string) => {
  return requestHelper('GET', '/v2/admin/quiz/trash', {}, { token });
};

const adminQuizNameUpdate = (token: string, quizId: number, name: string) => {
  return requestHelper('PUT', `/v2/admin/quiz/${quizId}/name`, { quizId, name }, { token });
};

const adminQuizDescriptionUpdate = (token: string, quizId: number, description: string) => {
  return requestHelper('PUT', `/v2/admin/quiz/${quizId}/description`, { quizId, description }, { token });
};

const adminQuizQuestionMove = (quizid: number, questionid: number, token: string, newPosition: number) => {
  return requestHelper('PUT', `/v2/admin/quiz/${quizid}/question/${questionid}/move`, { newPosition }, { token });
};

// const v2dminQuizQuestionCreate = (quizId: number, token: string, question: string, duration: number, points: number, answers: Answer[]) => {
//   const questionBody = {
//     question: question,
//     duration: duration,
//     points: points,
//     answers: answers,
//   };

//   return requestHelper('POST', `/v2/admin/quiz/${quizId}/question`, { questionBody }, { token });
// };

const adminAuthLogout = (token: string) => {
  return requestHelper('POST', '/v2/admin/auth/logout', {}, { token });
};

// const v2adminQuizQuestionDelete = (token: string, quizId: number, questionId: number) => {
//   return requestHelper('DELETE', `/v2/admin/quiz/${quizId}/question/${questionId}`, {}, { token });
// };

const v2adminQuizTransfer = (token: string, userEmail: string, quizId: number) => {
  return requestHelper('POST', `/v2/admin/quiz/${quizId}/transfer`, { userEmail }, { token });
};

const adminQuizTrashEmpty = (token: string, quizIds: string) => {
  return requestHelper('DELETE', '/v2/admin/quiz/trash/empty', { quizIds }, { token });
};

const adminQuizQuestionDuplicate = (token: string, quizId: number, questionId: number) => {
  return requestHelper('POST', `/v2/admin/quiz/${quizId}/question/${questionId}/duplicate`, {}, { token });
};

const adminQuizRestore = (token: string, quizId: number) => {
  return requestHelper('POST', `/v2/admin/quiz/${quizId}/restore`, { quizId }, { token });
};

const adminQuizSessionStart = (token: string, quizId: number, autoStartNum: number) => {
  return requestHelper('POST', `/v1/admin/quiz/${quizId}/session/start`, { autoStartNum }, { token });
};

const adminQuizSessionUpdate = (token: string, quizId: number, sessionId: number, action: string) => {
  return requestHelper('PUT', `/v1/admin/quiz/${quizId}/session/${sessionId}`, { action }, { token });
};

const adminQuizPlayerJoin = (sessionId: number, name: string) => {
  return requestHelper('POST', `/v1/player/join`, { sessionId, name });
};

const adminQuizPlayerSubmitAnswer = (playerId: number, questionPosition: number, answerIds: number[]) => {
  return requestHelper('PUT', `/v1/player/${playerId}/question/${questionPosition}/answer`, { answerIds });
};

const adminQuizThumbnailUpdate = (quizId: number, token: string, imgUrl: string) => {
  return requestHelper('PUT', '/v1/admin/quiz/{quizid}/thumbnail', {quizId, token, imgUrl});
}
// ============================================================================================== //

export {
  adminUserDetails,
  adminUserDetailsUpdate,
  adminUserPasswordUpdate,
  adminQuizList,
  v2adminQuizCreate,
  // v2adminQuizRemove,
  // v2adminQuizInfo,
  adminQuizNameUpdate,
  adminQuizDescriptionUpdate,
  adminQuizQuestionMove,
  adminAuthLogout,
  // v2adminQuizQuestionDelete,
  v2adminQuizTransfer,
  // v2adminQuizQuestionCreate,
  adminQuizQuestionDuplicate,
  adminQuizTrashView,
  adminQuizTrashEmpty,
  // v2adminQuizQuestionUpdate,
  adminQuizRestore,
  adminQuizSessionStart,
  adminQuizSessionUpdate,
  adminQuizPlayerJoin,
  adminQuizPlayerSubmitAnswer,
  adminQuizThumbnailUpdate
};
