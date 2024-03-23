import { setData } from './dataStore';
import { EmptyObject } from './interfaces';

function clear(): EmptyObject {
  setData({
    user: [],
    quizzes: [],
    sessions: [],
    trash: [],
  });

  return {};
}

export { clear };
