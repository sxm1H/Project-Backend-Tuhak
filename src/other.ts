import { getData, setData } from './dataStore';

interface EmptyObject {

}

function clear(): EmptyObject {

  setData({
    user: [],
    quizzes: [],
  });

  return {};
}

export { clear };

