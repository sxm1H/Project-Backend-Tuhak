import { setData } from './dataStore';

/**
 * clear() will clear the current database of data - used for jest tests.
 *
 * @returns {} Empty Object to indicidate that everything worked.
 */
function clear(): Record<string, never> {
  setData({
    user: [],
    quizzes: [],
    sessions: [],
    trash: [],
    quizActiveState: [],
    quizInactiveState: [],
    sessionIdCounter: 10000,
    answerIdCounter: 0,
    questionIdCounter: 0,
    quizIdCounter: 0
  });

  return {};
}

export { clear };
