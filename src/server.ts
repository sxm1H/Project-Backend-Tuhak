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

  if ('error' in response) {
    if (response.error === 'Token invalid.') {
      return res.status(401).json(response);
    } else if (response.error === 'User does not own this quiz.') {
      return res.status(403).json(response);
    } else {
      return res.status(400).json(response);
    }
  }

  save();
  res.json(response);
});

app.delete('/v1/clear', (req: Request, res: Response) => {
  res.json(clear());
});

app.post('/v1/admin/auth/register', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  const result = adminAuthRegister(email, password, nameFirst, nameLast);

  if ('error' in result) {
    return res.status(400).json(result);
  }

  save();
  res.json(result);
});

app.post('/v1/admin/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = adminAuthLogin(email, password);

  if ('error' in result) {
    return res.status(400).json(result);
  }

  save();
  res.json(result);
});

app.post('/v1/admin/quiz', (req: Request, res: Response) => {
  const { token, name, description } = req.body;
  const result = adminQuizCreate(token, name, description);

  if ('error' in result) {
    if (result.error === 'Token is not valid') {
      return res.status(401).json(result);
    }
    return res.status(400).json(result);
  }

  save();
  res.json(result);
});

app.delete('/v1/admin/quiz/:quizId', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const quizId = parseInt(req.params.quizId);

  const result = adminQuizRemove(token, quizId);

  if ('error' in result) {
    if (result.error === 'does not refer to valid logged in user session') {
      return res.status(401).json(result);
    } else {
      return res.status(403).json(result);
    }
  }

  save();
  res.json(result);
});

app.put('/v1/admin/quiz/:quizId/name', (req: Request, res: Response) => {
  const { token, name } = req.body;
  const quizId = parseInt(req.params.quizId);

  const result = adminQuizNameUpdate(token, quizId, name);

  if ('error' in result) {
    if (result.error === 'Quiz ID does not refer to a quiz that this user owns.' ||
        result.error === 'Quiz ID does not refer to a valid quiz') {
      return res.status(403).json(result);
    } else if (result.error === 'does not refer to valid logged in user session') {
      return res.status(401).json(result);
    } else {
      return res.status(400).json(result);
    }
  }

  save();
  res.json(result);
});

app.get('/v1/admin/user/details', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const response = adminUserDetails(token);

  if ('error' in response) {
    return res.status(401).json(response);
  }

  save();
  res.json(response);
});

app.get('/v1/admin/quiz/trash', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const response = adminQuizTrashView(token);
  if ('error' in response) {
    return res.status(401).json(response);
  }

  save();
  res.json(response);
});

app.put('/v1/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const { token, questionBody } = req.body;
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const response = adminQuizQuestionUpdate(questionBody, token, quizId, questionId);
  if ('error' in response) {
    if (response.error === 'Token invalid.') {
      return res.status(401).json(response);
    } else if (response.error === 'User does not own this quiz.') {
      return res.status(403).json(response);
    } else {
      return res.status(400).json(response);
    }
  }

  save();
  res.json(response);
});
app.put('/v1/admin/user/details', (req: Request, res: Response) => {
  const { token, email, nameFirst, nameLast } = req.body;
  const response = adminUserDetailsUpdate(token, email, nameFirst, nameLast);

  if ('error' in response) {
    if (response.error === 'Token is invalid.') {
      return res.status(401).json(response);
    } else {
      return res.status(400).json(response);
    }
  }

  save();
  res.json(response);
});

app.put('/v1/admin/user/password', (req: Request, res: Response) => {
  const { token, oldPassword, newPassword } = req.body;
  const response = adminUserPasswordUpdate(token, oldPassword, newPassword);

  if ('error' in response) {
    if (response.error === 'Token invalid') {
      return res.status(401).json(response);
    } else {
      return res.status(400).json(response);
    }
  }

  save();
  res.json(response);
});

app.get('/v1/admin/quiz/list', (req: Request, res: Response) => {
  const sessionId = req.query.token as string;
  const response = adminQuizList(sessionId);

  if ('error' in response) {
    return res.status(401).json(response);
  }

  save();
  res.json(response);
});

app.get('/v1/admin/quiz/:quizid', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const token = req.query.token as string;
  const response = adminQuizInfo(token, quizId);

  if ('error' in response) {
    if (response.error === 'Token invalid.') {
      return res.status(401).json(response);
    } else if (response.error === 'Quiz Id invalid.') {
      return res.status(400).json(response);
    } else if (response.error === 'User does not own this quiz.') {
      return res.status(403).json(response);
    }
  }

  save();
  res.json(response);
});

app.post('/v1/admin/quiz/:quizid/question', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const { token, questionBody } = req.body;
  const response = adminQuizQuestionCreate(quizId, token, questionBody);

  if ('error' in response) {
    if (response.error === 'Token invalid.') {
      return res.status(401).json(response);
    } else if (response.error === 'User does not own this quiz.') {
      return res.status(403).json(response);
    } else {
      return res.status(400).json(response);
    }
  }

  save();
  res.json(response);
});

app.post('/v1/admin/auth/logout', (req: Request, res: Response) => {
  const { token } = req.body;
  const response = adminAuthLogout(token);

  if ('error' in response) {
    return res.status(401).json(response);
  }

  save();
  res.json(response);
});

app.delete('/v1/admin/quiz/:quizid/question/:questionid', (req: Request, res: Response) => {
  const token = req.query.token as string;
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);

  const response = adminQuizQuestionDelete(token, quizId, questionId);

  if ('error' in response) {
    if (response.error === 'Token invalid.') {
      return res.status(401).json(response);
    } else if (response.error === 'User does not own this quiz.') {
      return res.status(403).json(response);
    } else {
      return res.status(400).json(response);
    }
  }

  save();
  res.json(response);
});

app.post('/v1/admin/quiz/:quizid/transfer', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const { token, userEmail } = req.body;
  const response = adminQuizTransfer(token, userEmail, quizId);

  if ('error' in response) {
    if (response.error === 'Token invalid.') {
      return res.status(401).json(response);
    } else if (response.error === 'User does not own this quiz.') {
      return res.status(403).json(response);
    } else if (response.error === 'Quiz Id does not refer to an existing quiz.') {
      return res.status(403).json(response);
    } else {
      return res.status(400).json(response);
    }
  }

  save();
  res.json(response);
});

app.delete('/v1/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const stringQuizIds = req.query.quizIds as string;
  const token = req.query.token as string;
  const response = adminQuizTrashEmpty(token, stringQuizIds);

  if ('error' in response) {
    if (response.error === 'Token invalid') {
      return res.status(401).json(response);
    } else if (response.error === 'a QuizId refers to a quiz that this current user does not own') {
      return res.status(403).json(response);
    } else if (response.error === 'One or more of the Quiz IDs is not currently in the trash') {
      return res.status(400).json(response);
    }
  }

  save();
  res.json(response);
});

app.put('/v1/admin/quiz/:quizid/question/:questionid/move', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const { token, newPosition } = req.body;

  const response = adminQuizQuestionMove(quizId, questionId, token, newPosition);

  if ('error' in response) {
    if (response.error === 'Token invalid.') {
      return res.status(401).json(response);
    } else if (response.error === 'User does not own this quiz') {
      return res.status(403).json(response);
    } else if (response.error === 'Quiz Id is invalid') {
      return res.status(403).json(response);
    } else {
      return res.status(400).json(response);
    }
  }

  save();
  res.json(response);
});

app.post('/v1/admin/quiz/:quizid/question/:questionid/duplicate', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const questionId = parseInt(req.params.questionid);
  const { token } = req.body;

  const response = adminQuizQuestionDuplicate(token, quizId, questionId);

  if ('error' in response) {
    if (response.error === 'Token invalid') {
      return res.status(401).json(response);
    } else if (response.error === 'User does not own this Quiz') {
      return res.status(403).json(response);
    } else if (response.error === 'Question id is invalid') {
      return res.status(400).json(response);
    }
  }

  save();
  res.json(response);
});

app.post('/v1/admin/quiz/:quizid/restore', (req: Request, res: Response) => {
  const quizId = parseInt(req.params.quizid);
  const { token } = req.body;

  const response = adminQuizRestore(token, quizId);

  if ('error' in response) {
    if (response.error === 'Token invalid.') {
      return res.status(401).json(response);
    } else if (response.error === 'Valid token, but user is not the owner of the quiz') {
      return res.status(403).json(response);
    } else if (response.error === 'Quiz Id not currently in trash' ||
            response.error === 'Quiz name of restored quiz already in use from active quiz') {
      return res.status(400).json(response);
    }
  }

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
