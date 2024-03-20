import { setData } from './dataStore';
import { EmptyObject } from './interfaces';

function clear(): EmptyObject {
  setData({
    user: [],
    quizzes: [],
    tokens: [],
    trash: [],
  });

  return {};
}

export { clear };

