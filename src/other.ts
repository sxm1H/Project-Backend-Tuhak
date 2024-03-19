import { getData, setData } from './dataStore';
import { EmptyObject } from './interfaces';

function clear(): EmptyObject {
  setData({
    user: [],
    quizzes: [],
  });

  return {};
}

export { clear };

