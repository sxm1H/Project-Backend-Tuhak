import { getData, setData } from './dataStore';
import validator from 'validator';
import {
  ErrorObject,
  TokenReturn,
  UserDetailsReturnObject,
  UserData
} from './interfaces';
import HTTPError from 'http-errors';
import crypto from 'crypto';
/**
  * Registers a user with a given email, password, first name and last name. The function pushes
  * the new user to be stores in the dataStore object and returns the new generated adminAuthId for
  * the newly registered user.
  * If any errors are occured, the user is not registered and the function returns an error message.
  *
  * @param {string} email - Email chosen by user to register.
  * @param {string} password - Password chosen by user to register.
  * @param {string} nameFirst - First name of user registering.
  * @param {string} nameLast - Last name of user registering.
  *
  * @returns {object {error: string}} - Error object with information regarding error.
  * @returns {object {token: string}} - Generated token to indicate the function worked.
*/
function adminAuthRegister(email: string, password: string, nameFirst: string, nameLast: string): ErrorObject | TokenReturn {
  const data = getData();
  // Returns user object if the email exists already
  console.log(data)
  const findEmail = data.user.find(user => user.email === email);

  // Error checking for all inputs
  if (findEmail) {
    throw HTTPError(400, 'Email is already in use.');
  } else if (validator.isEmail(email) === false) {
    throw HTTPError(400, 'Invalid email.');
  } else if (!nameFirst.match(/^[A-Za-z'" -]+$/)) {
    throw HTTPError(400, 'Invalid characters in first name.');
  } else if (nameFirst.length < 2 || nameFirst.length > 20) {
    throw HTTPError(400, 'Invalid first name length.');
  } else if (!nameLast.match(/^[A-Za-z'" -]+$/)) {
    throw HTTPError(400, 'Invalid characters in last name.');
  } else if (nameLast.length < 2 || nameLast.length > 20) {
    throw HTTPError(400, 'Invalid last name length.');
  } else if (password.length < 8) {
    throw HTTPError(400, 'Password must be at least 8 characters long.');
  } else if (!password.match(/[A-Za-z]/) || !password.match(/[0-9]/)) {
    throw HTTPError(400, 'Password must have at least one number and one letter.');
  }

  // Generation of authUserId and token
  const id = data.user.length + 1;
  // counters.sessionIdCounter++;
  // const token = counters.sessionIdCounter.toString();
  const token = getRandomToken();
  // Adds token to dataStore
  data.sessions.push({
    userId: id,
    token: token,
  });

  // Adds new user to dataStore
  data.user.push({
    email: email,
    password: getHash(password),
    nameFirst: nameFirst,
    nameLast: nameLast,
    userId: id,
    passwordHistory: [password],
    numSuccessfulLogins: 1,
    numFailedPasswordsSinceLastLogin: 0,
  });

  setData(data);
  return { token: token };
}

/**
  * <Given a registered user's email and password returns their token value>.
  *
  * @param {string} email - User email which may or not be registered
  * @param {string} password - Password that may or may not be correlated with specified email
  *
  * @returns {object {token: string}} returned token if email and password correlates to registered user.
  * @returns {object {error: string}} returns specified error message
*/
function adminAuthLogin(email: string, password: string): ErrorObject | TokenReturn {
  const newData = getData();
  const findUser = newData.user.find(user => user.email === email);

  if (!findUser) {
    throw HTTPError(400, 'Email address does not exist.');
  } else if (findUser.password !== getHash(password)) {
    findUser.numFailedPasswordsSinceLastLogin++;
    throw HTTPError(400, 'Password is not correct for the given email.');
  }

  findUser.numFailedPasswordsSinceLastLogin = 0;
  findUser.numSuccessfulLogins++;

  newData.sessionIdCounter++;
  const token = newData.sessionIdCounter.toString();

  newData.sessions.push({
    userId: findUser.userId,
    token: token
  });

  setData(data);
  return { token: token };
}

/**
  * Gets the token and if that matches a user updates their email or first name or last name
  * @param {string} token - The user's token for their session.
  *
  * @returns {object {error: string}} Error Object with information regarding the error.
  * @returns {
  *   user: {
  *     userId: number,
  *     name: string,
  *     email: string,
  *     numSuccessfulLogins: string,
  *     numFailedPasswordsSinceLastLogin: string
  *   }
  * } returns the user: object with the necessary values of the details returned.
*/
function adminUserDetails(token: string): ErrorObject | UserDetailsReturnObject {
  const data = getData();
  const findToken = data.sessions.find(sessions => sessions.token === token);

  if (!findToken) {
    throw HTTPError(401, 'Token invalid');
  }

  const findUser = data.user.find(user => user.userId === findToken.userId);
  setData(data);
  return {
    user: {
      userId: findUser.userId,
      name: findUser.nameFirst + ' ' + findUser.nameLast,
      email: findUser.email,
      numSuccessfulLogins: findUser.numSuccessfulLogins,
      numFailedPasswordsSinceLastLogin: findUser.numFailedPasswordsSinceLastLogin,
    }
  };
}

/**
  * Gets the token and if that matches a user updates their email or first name or last name
  * @param {string} token - the token of the user we want to change
  * @param {string} email - the email we want to update or keep
  * @param {string} nameFirst - the first name of the user we want to change or  keep the same
  * @param {string} nameLast - the last name of the user we want to change or keep the same
  *
  * @returns  {string} if there is an error occurs error string returned
  * @returns  {} if function is succesful returns empty object
*/
function adminUserDetailsUpdate(token: string, email: string, nameFirst: string, nameLast: string): ErrorObject | Record<string, never> {
  const data = getData();

  const sessionDetails = data.sessions.find(sessionId => sessionId.token === token);

  if (!(sessionDetails)) {
    throw HTTPError(401, 'Token invalid');
  }

  for (let i = 0; i < data.user.length; i++) {
    if (data.user[i].email === email) {
      if (sessionDetails.userId !== data.user[i].userId) {
        throw HTTPError(400, 'Email is already in use.');
      }
    }
  }

  const userId = sessionDetails.userId;
  const indexToUpdate = data.user.findIndex(user => user.userId === userId);

  if (validator.isEmail(email) === false) {
    throw HTTPError(400, 'Invalid email.');
  } else if (!nameFirst.match(/^[A-Za-z'" -]+$/)) {
    throw HTTPError(400, 'Invalid characters in first name.');
  } else if (nameFirst.length < 2 || nameFirst.length > 20) {
    throw HTTPError(400, 'Invalid first name length.');
  } else if (!nameLast.match(/^[A-Za-z'" -]+$/)) {
    throw HTTPError(400, 'Invalid characters in last name.');
  } else if (nameLast.length < 2 || nameLast.length > 20) {
    throw HTTPError(400, 'Invalid last name length.');
  }

  data.user[indexToUpdate].email = email;
  data.user[indexToUpdate].nameFirst = nameFirst;
  data.user[indexToUpdate].nameLast = nameLast;
  
  setData(data);
  return {};
}

/**
  * The helper function passwordChecker is assisting the function
  * adminUserPasswordUpdate. PasswordChecker takes in an object containing
  * the User's Details, their old Password, and the password they want to change
  * it to.
  *
  * This function does the main error checking for the new password
  *   1. Is the new password the same as the old password (If the same then new password invalid)
  *   2. Has the password been used before (If it has then new password invalid)
  *   3. Password length (If less than 8 characters then new password invalid)
  *   4. Is there at least one letter and one number (If there is no letter or/and no number
  *     then new password invalid)
  * Afterwards, the function returns an error object containing the relevant error message.
  * Note: The function returns an error object even if no errors have been detected.
  * However, the error message is 'No Error'.
  *
  * @param {
  *   object {
  *     email: string,
  *     password: string,
  *     nameFirst: string,
  *     nameLast: string,
  *     userId: integer,
  *     passwordHistory: array of strings,
  *     numSuccessfulLogins: integer,
  *     numFailedPasswordSinceLastLogin: integer,
  *   }
  * } userDetails - This object contains all of the user's data
  * @param {string} oldPassword - User's current password.
  * @param {string} newPassword - User's new password.
  *
  * @returns { Error Object } Error Object with information regarding the error.
*/
function passwordChecker(userDetails: UserData, oldPassword: string, newPassword: string): Record<string, never> {
  // Error Checks for the passwords.
  if (oldPassword === newPassword) {
    throw HTTPError(400, 'New Password is the same as old passward.');
  }
  for (let i = 0; i < userDetails.passwordHistory.length; i++) {
    if (newPassword === userDetails.passwordHistory[i]) {
      throw HTTPError(400, 'Password has already been used before.');
    }
  }
  if (newPassword.length < 8) {
    throw HTTPError(400, 'New Password must be at least 8 characters long.');
  }

  // Checking whether there is at least one letter and one number.
  let letterCounter = 0;
  let numberCounter = 0;
  for (let i = 0; i < newPassword.length; i++) {
    if (newPassword[i] >= 'a' && newPassword[i] <= 'z') {
      letterCounter++;
    }
    if (newPassword[i] >= 'A' && newPassword[i] <= 'Z') {
      letterCounter++;
    }
    if (newPassword[i] >= '0' && newPassword[i] <= '9') {
      numberCounter++;
    }
  }

  if (letterCounter === 0 || numberCounter === 0) {
    throw HTTPError(400, 'New Password must have at least one number and one letter.');
  }

  return {};
}

/**
  * adminUserPasswordUpdate takes in the user's current token, current password and the
  * password they want to change it to. If the current and new password passes
  * a series of error checks, their password will be changed and updated
  * and pushed onto the passwordHistory.
  *
  * This function does some preliminary error checking for
  *   1. Is the token Valid
  *   2. Check if the inputted oldPassword is their correct current password
  * Afterwards, error checking for the new password is done in the helper function
  * passwordChecker.
  *
  * @param {string} token - This is the user's token for their session.
  * @param {string} oldPassword - User's current password.
  * @param {string} newPassword - User's new password.
  *
  * @returns {object {error: string}} Error Object with information regarding the error.
  * @returns {} Empty Object to indicate that everything worked.
*/
function adminUserPasswordUpdate(token: string, oldPassword: string, newPassword: string): ErrorObject | Record<string, never> {
  const data = getData();
  // Finding the token.
  const findToken = data.sessions.find(sessionId => sessionId.token === token);
  if (!findToken) {
    throw HTTPError(401, 'Token invalid');
  }

  // Getting the userInfo
  const userInfo = data.user.find(id => id.userId === findToken.userId);

  // Checking if the current pass was entered correctly.
  if (getHash(oldPassword) !== userInfo.password) {
    throw HTTPError(400, 'Password Entered Is Incorrect.');
  }

  // Passing into Helper To Do The Rest of the Error Checks.
  passwordChecker(userInfo, oldPassword, newPassword);

  // Now checking the contents of the return.
  userInfo.passwordHistory.push(getHash(newPassword));
  userInfo.password = getHash(newPassword);

  setData(data);
  return {};
}

/**
  * adminAuthLogout takes in the user's current token, allowing them to logout of their current
  * session. This is done by deleting the session from the dataStore.
  *
  * This function does some preliminary error checking for
  *   1. Is the token valid
  *
  * @param {string} token - This is the user's token for their session.
  *
  * @returns {object {error: string}} Error Object with information regarding the error.
  * @returns {object {}} Empty Object to indicidate that everything worked.
*/
function adminAuthLogout(token: string): ErrorObject | Record<string, never> {
  const data = getData();
  const findTokenIndex = data.sessions.findIndex(session => session.token === token);

  // Error checking: token invalid
  if (findTokenIndex === -1) {
    throw HTTPError(401, 'Token invalid');
  }

  // Deletes the session object and shuffles the array accordingly.
  data.sessions.splice(findTokenIndex, 1);
  setData(data);
  return {};
}

function getHash(string: string) {
  return crypto.createHash('sha256').update(string).digest('hex');
}

function getRandomToken() {
  const data = getData();
  const token = Math.floor(Math.random() * 100000).toString();

  const found = data.sessions.find(id => id.token === token);

  if (found) {
    getRandomToken();
  }

  return token;
}

export {
  adminAuthLogin,
  adminAuthRegister,
  adminUserDetails,
  adminUserDetailsUpdate,
  adminUserPasswordUpdate,
  adminAuthLogout
};
