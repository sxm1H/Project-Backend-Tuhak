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
import { createClient } from '@vercel/kv';
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
  adminQuizThumbnailUpdate,
  v2adminQuizCreate,
  v2adminQuizRemove,
  v2adminQuizTransfer,
  v2AdminQuizQuestionCreate,
  v2AdminQuizInfo,
  v2AdminQuizQuestionUpdate,
  v2adminQuizQuestionDelete,
  adminQuizSessions,
  adminQuizGetSessionStatus,
  adminQuizPlayerStatus,
  adminQuizPlayerQuestionInformation,
  adminQuizChat,
  adminQuizChatSend,
  adminQuizQuestionResults,
  adminQuizFinalResults,
  adminQuizCompletedQuizResults,
  adminQuizFinalResultsCSV,
} from './v2quiz';
// import { getData, setData } from './dataStore'

const KV_REST_API_URL="https://logical-hermit-49437.upstash.io"
const KV_REST_API_TOKEN="AcEdASQgMTljMDdjMTYtOWNkZC00MjcwLTlmZGItZTg2ZjJiY2YzNjNlOGE0ZjQ3ZDU2MmY0NDdhNDk5NzRhM2Y5MjY1Y2VkZjA="

const database = createClient({
  url: KV_REST_API_URL,
  token: KV_REST_API_TOKEN,
});

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
app.get('/data', async (req: Request, res: Response) => {
  const data = await database.hgetall("data:names");
  res.status(200).json(data);
});

app.put('/data', async (req: Request, res: Response) => {
  const { data } = req.body;
  await database.hset("data:names", { data });
  return res.status(200).json({});
});

// Example get request
app.get('/echo', (req: Request, res: Response) => {
  const data = req.query.echo as string;
  return res.json(echo(data));
});

app.put('/v1/admin/quiz/:quizid/description', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const { token, description } = req.body;

  const response = adminQuizDescriptionUpdate(token, quizId, description);

  res.json(response);
});

app.delete('/v1/clear', (req: Request, res: Response) => {
  res.json(clear());
});

app.post('/v1/admin/auth/register', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  const result = adminAuthRegister(email, password, nameFirst, nameLast);

  res.json(result);
});

app.post('/v1/admin/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = adminAuthLogin(email, password);

  res.json(result);
});

app.post('/v1/admin/quiz', (req: Request, res: Response) => {
  const { token, name, description } = req.body;
  const result = adminQuizCreate(token, name, description);

  res.json(result);
});

app.delete('/v1/admin/quiz/:quizId', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const quizId = parseInt(req.params.quizId);
  const result = adminQuizRemove(token, quizId);

  res.json(result);
});

app.put('/v1/admin/quiz/:quizId/name', (req: Request, res: Response) => {
  const { token, name } = req.body;
  const quizId = parseInt(req.params.quizId);
  const result = adminQuizNameUpdate(token, quizId, name);

  res.json(result);
});

app.get('/v1/admin/user/details', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const response = adminUserDetails(token);

  res.json(response);
});

app.get('/v1/admin/quiz/trash', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const response = adminQuizTrashView(token);

  res.json(response);
});

app.put('/v1/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const { token, questionBody } = req.body;
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const response = adminQuizQuestionUpdate(questionBody, token, quizId, questionId);

  res.json(response);
});

app.put('/v1/admin/user/details', (req: Request, res: Response) => {
  const { token, email, nameFirst, nameLast } = req.body;
  const response = adminUserDetailsUpdate(token, email, nameFirst, nameLast);

  res.json(response);
});

app.put('/v1/admin/user/password', (req: Request, res: Response) => {
  const { token, oldPassword, newPassword } = req.body;
  const response = adminUserPasswordUpdate(token, oldPassword, newPassword);

  res.json(response);
});

app.get('/v1/admin/quiz/list', (req: Request, res: Response) => {
  const sessionId = req.query.token as string;
  const response = adminQuizList(sessionId);

  res.json(response);
});

app.get('/v1/admin/quiz/:quizid', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.query.token as string;
  const response = adminQuizInfo(token, quizId);

  res.json(response);
});

app.post('/v1/admin/quiz/:quizid/question', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const { token, questionBody } = req.body;
  const response = adminQuizQuestionCreate(quizId, token, questionBody);

  res.json(response);
});

app.post('/v1/admin/auth/logout', (req: Request, res: Response) => {
  const { token } = req.body;
  const response = adminAuthLogout(token);

  res.json(response);
});

app.delete('/v1/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const response = adminQuizQuestionDelete(token, quizId, questionId);

  res.json(response);
});

app.post('/v1/admin/quiz/:quizid/transfer', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const { token, userEmail } = req.body;
  const response = adminQuizTransfer(token, userEmail, quizId);

  res.json(response);
});

app.delete('/v1/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const stringQuizIds = req.query.quizIds as string;
  const token = req.query.token as string;
  const response = adminQuizTrashEmpty(token, stringQuizIds);

  res.json(response);
});

app.put('/v1/admin/quiz/:quizid/question/:questionid/move', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const { token, newPosition } = req.body;
  const response = adminQuizQuestionMove(quizId, questionId, token, newPosition);

  res.json(response);
});

app.post('/v1/admin/quiz/:quizid/question/:questionid/duplicate', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const { token } = req.body;
  const response = adminQuizQuestionDuplicate(token, quizId, questionId);

  res.json(response);
});

app.post('/v1/admin/quiz/:quizid/restore', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const { token } = req.body;
  const response = adminQuizRestore(token, quizId);

  res.json(response);
});

// ==================== UNDERNEATH IS V2 FUNCTIONS ====================
// == ANY FUNCTION THAT IS COMMENTED OUT REQUIRES IMPLEMENTATION SINCE INPUT / OUTPUT IS DIFFERENT ==
// 6 function should be commented out (specifics of these functions found in 5. index of README)

app.post('/v2/admin/auth/logout', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const response = adminAuthLogout(token);

  res.json(response);
});

app.get('/v2/admin/user/details', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const response = adminUserDetails(token);

  res.json(response);
});

app.put('/v2/admin/user/details', (req: Request, res: Response) => {
  const { email, nameFirst, nameLast } = req.body;
  const token = req.headers.token as string;
  const response = adminUserDetailsUpdate(token, email, nameFirst, nameLast);

  res.json(response);
});

app.put('/v2/admin/user/password', (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const token = req.headers.token as string;
  const response = adminUserPasswordUpdate(token, oldPassword, newPassword);

  res.json(response);
});

app.get('/v2/admin/quiz/list', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const response = adminQuizList(token);

  res.json(response);
});

app.post('/v2/admin/quiz', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const { name, description } = req.body;
  const result = v2adminQuizCreate(token, name, description);

  res.json(result);
});

// One new 400 error check (END state checking)

app.delete('/v2/admin/quiz/:quizId', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizId);
  const result = v2adminQuizRemove(token, quizId);

  res.json(result);
});

app.get('/v2/admin/quiz/trash', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const response = adminQuizTrashView(token);

  res.json(response);
});

app.get('/v2/admin/quiz/:quizid', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.headers.token as string;
  const response = v2AdminQuizInfo(token, quizId);

  res.json(response);
});

app.put('/v2/admin/quiz/:quizId/name', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const { name } = req.body;
  const quizId = parseInt(req.params.quizId);
  const result = adminQuizNameUpdate(token, quizId, name);

  res.json(result);
});

app.put('/v2/admin/quiz/:quizid/description', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizid);
  const { description } = req.body;
  const response = adminQuizDescriptionUpdate(token, quizId, description);

  res.json(response);
});

app.post('/v2/admin/quiz/:quizid/restore', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.headers.token as string;
  const response = adminQuizRestore(token, quizId);

  res.json(response);
});

app.delete('/v2/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const stringQuizIds = req.query.quizIds as string;
  const token = req.headers.token as string;
  const response = adminQuizTrashEmpty(token, stringQuizIds);

  res.json(response);
});

app.post('/v2/admin/quiz/:quizid/transfer', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.headers.token as string;
  const { userEmail } = req.body;
  const response = v2adminQuizTransfer(token, userEmail, quizId);

  res.json(response);
});

app.post('/v2/admin/quiz/:quizid/question', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.headers.token as string;
  const { questionBody } = req.body;
  const response = v2AdminQuizQuestionCreate(quizId, token, questionBody);

  res.json(response);
});

app.put('/v2/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const { questionBody } = req.body;
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const response = v2AdminQuizQuestionUpdate(questionBody, token, quizId, questionId);

  res.json(response);
});

app.delete('/v2/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const response = v2adminQuizQuestionDelete(token, quizId, questionId);

  res.json(response);
});

app.put('/v2/admin/quiz/:quizid/question/:questionid/move', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const { newPosition } = req.body;
  const response = adminQuizQuestionMove(quizId, questionId, token, newPosition);

  res.json(response);
});

app.post('/v2/admin/quiz/:quizid/question/:questionid/duplicate', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const token = req.headers.token as string;
  const response = adminQuizQuestionDuplicate(token, quizId, questionId);

  res.json(response);
});

// ==================== UNDERNEATH IS NEW ITER 3 FUNCTIONS ====================

app.post('/v1/admin/quiz/:quizid/session/start', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const { autoStartNum } = req.body;
  const token = req.headers.token as string;

  const response = adminQuizSessionCreate(token, quizId, autoStartNum);

  res.json(response);
});

app.put('/v1/admin/quiz/:quizid/session/:sessionid', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const sessionId = parseInt(req.params.sessionid);
  const { action } = req.body;
  const token = req.headers.token as string;

  const response = adminQuizSessionUpdate(token, quizId, sessionId, action);

  res.json(response);
});

app.post('/v1/player/join', (req: Request, res: Response) => {
  const { sessionId, name } = req.body;

  const response = adminQuizSessionJoin(sessionId, name);

  res.json(response);
});

app.put('/v1/player/:playerid/question/:questionposition/answer', (req: Request, res: Response) => {
  const { answerIds } = req.body;
  const playerid = parseInt(req.params.playerid);
  const questionposition = parseInt(req.params.questionposition);

  const response = adminQuizPlayerSubmitAnswer(answerIds, playerid, questionposition);

  res.json(response);
});

app.put('/v1/admin/quiz/:quizid/thumbnail', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.headers.token as string;
  const { imgUrl } = req.body;

  const response = adminQuizThumbnailUpdate(quizId, token, imgUrl);

  res.json(response);
});

app.get('/v1/admin/quiz/:quizid/sessions', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizid);
  const response = adminQuizSessions(token, quizId);

  res.json(response);
});

app.get('/v1/admin/quiz/:quizid/session/:sessionid', (req: Request, res: Response) => {
  const token = req.headers.token as string;
  const quizId = parseInt(req.params.quizid);
  const sessionId = parseInt(req.params.sessionid);
  const response = adminQuizGetSessionStatus(quizId, sessionId, token);

  res.json(response);
});

app.get('/v1/player/:playerid', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const response = adminQuizPlayerStatus(playerId);

  res.json(response);
});

app.get('/v1/player/:playerid/question/:questionposition', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const questionposition = parseInt(req.params.questionposition);
  const response = adminQuizPlayerQuestionInformation(playerId, questionposition);

  res.json(response);
});

app.get('/v1/player/:playerid/chat', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const response = adminQuizChat(playerId);

  res.json(response);
});

app.post('/v1/player/:playerid/chat', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const { message } = req.body;
  const response = adminQuizChatSend(playerId, message.messageBody);

  res.json(response);
});
app.get('/v1/player/:playerid/question/:questionposition/results', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const questionPosition = parseInt(req.params.questionposition);
  const response = adminQuizQuestionResults(playerId, questionPosition);

  res.json(response);
});

app.get('/v1/player/:playerid/results', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const response = adminQuizFinalResults(playerId);

  res.json(response);
});

app.get('/v1/admin/quiz/:quizid/session/:sessionid/results', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const sessionId = parseInt(req.params.sessionid);
  const token = req.headers.token as string;
  const response = adminQuizCompletedQuizResults(quizId, sessionId, token);

  res.json(response);
});

app.get('/v1/admin/quiz/:quizid/session/:sessionid/results/csv', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const sessionId = parseInt(req.params.sessionid);
  const token = req.headers.token as string;
  const response = adminQuizFinalResultsCSV(quizId, sessionId, token);
  console.log(response);

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
