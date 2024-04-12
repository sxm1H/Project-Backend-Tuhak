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
  });

  return {};
}

export { clear };
