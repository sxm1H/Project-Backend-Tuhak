import express, { json, Request, Response } from 'express';
import { echo } from './newecho';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import process from 'process';
import { clear } from './other';
import {
  adminAuthLogin,
  adminAuthRegister,
  adminUserDetails,
  adminUserDetailsUpdate,
  adminUserPasswordUpdate,
  adminAuthLogout
} from './auth';
import {
  adminQuizNameUpdate,
  adminQuizRemove,
  adminQuizList,
  adminQuizInfo,
  adminQuizCreate,
  adminQuizDescriptionUpdate,
  adminQuizQuestionDelete,
  adminQuizTransfer,
  adminQuizQuestionCreate,
  adminQuizTrashEmpty,
  adminQuizQuestionMove,
  adminQuizQuestionDuplicate,
  adminQuizTrashView,
  adminQuizQuestionUpdate,
  adminQuizRestore
} from './quiz';

import {
  adminQuizPlayerSubmitAnswer,
  adminQuizSessionCreate, 
  adminQuizSessionJoin, 
  adminQuizSessionUpdate,
  v2AdminQuizRemove,
  v2AdminQuizTransfer,
} from './v2quiz'

// import {
//   v2adminUserDetails,
//   v2adminUserDetailsUpdate,
//   v2adminUserPasswordUpdate,
//   v2adminAuthLogout
// } from './v2auth';
import {
//   v2adminQuizNameUpdate,
//   v2adminQuizRemove,
//   v2adminQuizList,
//   v2adminQuizInfo,
  v2adminQuizCreate,
//   v2adminQuizDescriptionUpdate,
//   v2adminQuizQuestionDelete,
//   v2adminQuizTransfer,
//   v2adminQuizQuestionCreate,
//   v2adminQuizTrashEmpty,
//   v2adminQuizQuestionMove,
//   v2adminQuizQuestionDuplicate,
//   v2adminQuizTrashView,
//   v2adminQuizQuestionUpdate,
//   v2adminQuizRestore
} from './v2quiz';
import { getData, setData, setCounters, getCounters } from './dataStore';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());
// for logging errors (print to terminal)
app.use(morgan('dev'));
// for producing the docs that define the API
const file = fs.readFileSync(path.join(process.cwd(), 'swagger.yaml'), 'utf8');
app.get('/', (req: Request, res: Response) => res.redirect('/docs'));
app.use('/docs', sui.serve, sui.setup(YAML.parse(file), { swaggerOptions: { docExpansion: config.expandDocs ? 'full' : 'list' } }));

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || '127.0.0.1';

// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================

const load = () => {
  if (fs.existsSync('./database.json')) {
    const file = fs.readFileSync('./database.json', { encoding: 'utf8' });
    const count = fs.readFileSync('./counters.json', { encoding: 'utf8' });
    setData(JSON.parse(file));
    setCounters(JSON.parse(count));
  }
};
load();

const save = () => {
  fs.writeFileSync('./database.json', JSON.stringify(getData()));
  fs.writeFileSync('./counters.json', JSON.stringify(getCounters()));
};

// Example get request
app.get('/echo', (req: Request, res: Response) => {
  const data = req.query.echo as string;
  return res.json(echo(data));
});

app.put('/v1/admin/quiz/:quizid/description', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const { token, description } = req.body;

  const response = adminQuizDescriptionUpdate(token, quizId, description);

  save();
  res.json(response);
});

app.delete('/v1/clear', (req: Request, res: Response) => {
  res.json(clear());
});

app.post('/v1/admin/auth/register', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  const result = adminAuthRegister(email, password, nameFirst, nameLast);

  save();
  res.json(result);
});

app.post('/v1/admin/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = adminAuthLogin(email, password);

  save();
  res.json(result);
});

app.post('/v1/admin/quiz', (req: Request, res: Response) => {
  const { token, name, description } = req.body;
  const result = adminQuizCreate(token, name, description);

  save();
  res.json(result);
});

app.delete('/v1/admin/quiz/:quizId', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const quizId = parseInt(req.params.quizId);
  const result = adminQuizRemove(token, quizId);

  save();
  res.json(result);
});

app.put('/v1/admin/quiz/:quizId/name', (req: Request, res: Response) => {
  const { token, name } = req.body;
  const quizId = parseInt(req.params.quizId);
  const result = adminQuizNameUpdate(token, quizId, name);

  save();
  res.json(result);
});

app.get('/v1/admin/user/details', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const response = adminUserDetails(token);

  save();
  res.json(response);
});

app.get('/v1/admin/quiz/trash', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const response = adminQuizTrashView(token);

  save();
  res.json(response);
});

app.put('/v1/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const { token, questionBody } = req.body;
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const response = adminQuizQuestionUpdate(questionBody, token, quizId, questionId);

  save();
  res.json(response);
});

app.put('/v1/admin/user/details', (req: Request, res: Response) => {
  const { token, email, nameFirst, nameLast } = req.body;
  const response = adminUserDetailsUpdate(token, email, nameFirst, nameLast);

  save();
  res.json(response);
});

app.put('/v1/admin/user/password', (req: Request, res: Response) => {
  const { token, oldPassword, newPassword } = req.body;
  const response = adminUserPasswordUpdate(token, oldPassword, newPassword);

  save();
  res.json(response);
});

app.get('/v1/admin/quiz/list', (req: Request, res: Response) => {
  const sessionId = req.query.token as string;
  const response = adminQuizList(sessionId);

  save();
  res.json(response);
});

app.get('/v1/admin/quiz/:quizid', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.query.token as string;
  const response = adminQuizInfo(token, quizId);

  save();
  res.json(response);
});

app.post('/v1/admin/quiz/:quizid/question', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const { token, questionBody } = req.body;
  const response = adminQuizQuestionCreate(quizId, token, questionBody);

  save();
  res.json(response);
});

app.post('/v1/admin/auth/logout', (req: Request, res: Response) => {
  const { token } = req.body;
  const response = adminAuthLogout(token);

  save();
  res.json(response);
});

app.delete('/v1/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const response = adminQuizQuestionDelete(token, quizId, questionId);

  save();
  res.json(response);
});

app.post('/v1/admin/quiz/:quizid/transfer', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const { token, userEmail } = req.body;
  const response = adminQuizTransfer(token, userEmail, quizId);

  save();
  res.json(response);
});

app.delete('/v1/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const stringQuizIds = req.query.quizIds as string;
  const token = req.query.token as string;
  const response = adminQuizTrashEmpty(token, stringQuizIds);

  save();
  res.json(response);
});

app.put('/v1/admin/quiz/:quizid/question/:questionid/move', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const { token, newPosition } = req.body;
  const response = adminQuizQuestionMove(quizId, questionId, token, newPosition);

  save();
  res.json(response);
});

app.post('/v1/admin/quiz/:quizid/question/:questionid/duplicate', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const { token } = req.body;
  const response = adminQuizQuestionDuplicate(token, quizId, questionId);

  save();
  res.json(response);
});

app.post('/v1/admin/quiz/:quizid/restore', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const { token } = req.body;
  const response = adminQuizRestore(token, quizId);

  save();
  res.json(response);
});

// ==================== UNDERNEATH IS V2 FUNCTIONS ====================
// == ANY FUNCTION THAT IS COMMENTED OUT REQUIRES IMPLEMENTATION SINCE INPUT / OUTPUT IS DIFFERENT ==
// 6 function should be commented out (specifics of these functions found in 5. index of README)

app.post('/v2/admin/auth/logout', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const response = adminAuthLogout(token);

  save();
  res.json(response);
});

app.get('/v2/admin/user/details', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const response = adminUserDetails(token);

  save();
  res.json(response);
});

app.put('/v2/admin/user/details', (req: Request, res: Response) => {
  const { email, nameFirst, nameLast } = req.body;
  const token = req.headers.token as string;
  const response = adminUserDetailsUpdate(token, email, nameFirst, nameLast);

  save();
  res.json(response);
});

app.put('/v2/admin/user/password', (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const token = req.headers.token as string;
  const response = adminUserPasswordUpdate(token, oldPassword, newPassword);

  save();
  res.json(response);
});

app.get('/v2/admin/quiz/list', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const response = adminQuizList(token);

  save();
  res.json(response);
});

app.post('/v2/admin/quiz', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const { name, description } = req.body;
  const result = v2adminQuizCreate(token, name, description);

  save();
  res.json(result);
});

// One new 400 error check (END state checking)

app.delete('/v2/admin/quiz/:quizId', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizId);
  const result = v2AdminQuizRemove(token, quizId);

  save();
  res.json(result);
});

// /////// Requires a new implementation which puts questionUrl in both quiz and question
// which probably means that we will have to update more than just 6 functions

// app.get('/v2/admin/quiz/:quizid', (req: Request, res: Response) => {
//   const quizId = parseInt(req.params.quizid);
//   const token = req.headers.token as string;
//   const response = v2AdminQuizInfo(token, quizId);

//   save();
//   res.json(response);
// });

app.put('/v2/admin/quiz/:quizId/name', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const { name } = req.body;
  const quizId = parseInt(req.params.quizId);
  const result = adminQuizNameUpdate(token, quizId, name);

  save();
  res.json(result);
});

app.put('/v2/admin/quiz/:quizid/description', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizid);
  const { description } = req.body;
  const response = adminQuizDescriptionUpdate(token, quizId, description);

  save();
  res.json(response);
});

app.get('/v2/admin/quiz/trash', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const response = adminQuizTrashView(token);

  save();
  res.json(response);
});

app.post('/v2/admin/quiz/:quizid/restore', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.headers.token as string;
  const response = adminQuizRestore(token, quizId);

  save();
  res.json(response);
});

app.delete('/v2/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const stringQuizIds = req.query.quizIds as string;
  const token = req.headers.token as string;
  const response = adminQuizTrashEmpty(token, stringQuizIds);

  save();
  res.json(response);
});

app.post('/v2/admin/quiz/:quizid/transfer', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.headers.token as string;
  const { userEmail } = req.body;
  const response = v2AdminQuizTransfer(token, userEmail, quizId);

  save();
  res.json(response);
});

/// / Requires new implementation to input thumbnail parameters into the question
//
/// / Also more errors zZzZz
// app.post('/v2/admin/quiz/:quizid/question', (req: Request, res: Response) => {
//   const quizId = parseInt(req.params.quizid);
//   const token = req.headers.token as string;
//   const { questionBody, thumbnailUrl } = req.body;
//   const response = v2AdminQuizQuestionCreate(quizId, token, questionBody, thumbnailUrl);

//   save();
//   res.json(response);
// });

/// / This simply just requires a new thumbnail parameter (new function in quiz.ts, prepended w/ v2)
//
// app.put('/v2/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
//   const token = req.headers.token as string;
//   const { questionBody, thumbnailUrl } = req.body;
//   const quizId = parseInt(req.params.quizid);
//   const questionId = parseInt(req.params.questionid);
//   const response = v2AdminQuizQuestionUpdate(questionBody, token, quizId, questionId, thumbnailUrl);

//   save();
//   res.json(response);
// });

/// / Simply just one new error check (END state of a quiz)
//
// app.delete('/v2/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
//   const token = req.headers.token as string;
//   const quizId = parseInt(req.params.quizid);
//   const questionId = parseInt(req.params.questionid);
//   const response = adminQuizQuestionDelete(token, quizId, questionId);

//   save();
//   res.json(response);
// });

app.put('/v2/admin/quiz/:quizid/question/:questionid/move', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const { newPosition } = req.body;
  const response = adminQuizQuestionMove(quizId, questionId, token, newPosition);

  save();
  res.json(response);
});

app.post('/v2/admin/quiz/:quizid/question/:questionid/duplicate', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const token = req.headers.token as string;
  const response = adminQuizQuestionDuplicate(token, quizId, questionId);

  save();
  res.json(response);
});

// ==================== UNDERNEATH IS NEW ITER 3 FUNCTIONS ====================

app.post('/v1/admin/quiz/:quizid/session/start', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const { autoStartNum } = req.body;
  const token = req.headers.token as string;

  const response = adminQuizSessionCreate(quizId, token, autoStartNum);

  save();
  res.json(response);
});

app.put('/v1/admin/quiz/:quizid/session/:sessionid', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const sessionId = parseInt(req.params.sessionid);
  const { action } = req.body;
  const token = req.headers.token as string;

  const response = adminQuizSessionUpdate(quizId, sessionId, token, action);

  save();
  res.json(response);
});

app.post('/v1/player/join', (req: Request, res: Response) => {
  const { sessionId, name } = req.body;

  const response = adminQuizSessionJoin(sessionId, name);

  save();
  res.json(response);
});

app.put('/v1/player/:playerid/question/:questionposition/answer', (req: Request, res: Response) => {
  const { answerIds } = req.body;
  const playerid = parseInt(req.params.playerid);
  const questionposition = parseInt(req.params.questionposition);

  const response = adminQuizPlayerSubmitAnswer(answerIds, playerid, questionposition);

  save();
  res.json(response);
});




// ====================================================================
//  ================= WORK IS DONE ABOVE THIS LINE ===================
// ====================================================================

app.use((req: Request, res: Response) => {
  const error = `
    Route not found - This could be because:
      0. You have defined routes below (not above) this middleware in server.ts
      1. You have not implemented the route ${req.method} ${req.path}
      2. There is a typo in either your test or server, e.g. /posts/list in one
         and, incorrectly, /post/list in the other
      3. You are using ts-node (instead of ts-node-dev) to start your server and
         have forgotten to manually restart to load the new changes
      4. You've forgotten a leading slash (/), e.g. you have posts/list instead
         of /posts/list in your server.ts or test file
  `;
  res.json({ error });
});

// For handling errors
app.use(errorHandler());

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
