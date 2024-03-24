import { getData } from './dataStore';
import validator from 'validator';
import {
  ErrorObject,
  EmptyObject,
  AdminId,
  TokenReturn,
  UserDetailsReturnObject,
  UserData
} from './interfaces';

let sessionIdCounter = 10000;

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
  * @returns {
  *   object {
  *     error: string
  *   }
  * } - Error object with information regarding error.
  * @returns {
  *   object {
  *     authUserId: number
  *   }
  * } - Generated authUserId to indicate the function worked.
*/
function adminAuthRegister(email: string, password: string, nameFirst: string, nameLast: string): ErrorObject | TokenReturn {
  const data = getData();

  for (let i = 0; i < data.user.length; i++) {
    if (data.user[i].email === email) {
      return { error: 'Email is already in use.' };
    }
  }

  if (validator.isEmail(email) === false) {
    return {
      error: 'Invalid email.',
    };
  }

  if (Boolean(nameFirst.match(/^[A-Za-z'" -]+$/)) === false) {
    return {
      error: 'Invalid characters in first name.',
    };
  }

  if (nameFirst.length < 2 || nameFirst.length > 20) {
    return {
      error: 'Invalid first name length.',
    };
  }

  if (Boolean(nameLast.match(/^[A-Za-z'" -]+$/)) === false) {
    return {
      error: 'Invalid characters in last name.',
    };
  }

  if (nameLast.length < 2 || nameLast.length > 20) {
    return {
      error: 'Invalid last name length.',
    };
  }

  if (password.length < 8) {
    return {
      error: 'Password must be at least 8 characters long.',
    };
  }

  if (Boolean(password.match(/[A-Za-z]/)) === false ||
      Boolean(password.match(/[0-9]/)) === false) {
    return {
      error: 'Password must have at least one number and one letter.',
    };
  }

  const id = data.user.length + 1;
  sessionIdCounter++;
  let token = sessionIdCounter.toString();
  
  data.sessions.push({
    userId: id,
    token: token,
  });

  data.user.push({
    email: email,
    password: password,
    nameFirst: nameFirst,
    nameLast: nameLast,
    userId: id,
    passwordHistory: [password],
    numSuccessfulLogins: 1,
    numFailedPasswordsSinceLastLogin: 0,
  });

  return {
    token: token,
  }
}

/**
  * <Given a registered user's email and password returns their authUserId value>.
  *
  * @param {string} email - User email which may or not be registered
  * @param {string} password - Password that may or may not be correlated with specified email
  *
  * @returns {object {token: number}} returned token if email and password correlates to registered user.
  * @returns {object {error: string}} returns specified error message
*/
function adminAuthLogin(email: string, password: string): ErrorObject | TokenReturn {
  const newData = getData();

  for (const data of newData.user) {
    if (data.email === email) {
      if (data.password === password) {
        data.numFailedPasswordsSinceLastLogin = 0;
        data.numSuccessfulLogins++;
        for (const tokens of newData.sessions) {
          if (tokens.userId === data.userId) {
            sessionIdCounter++;
            let token = sessionIdCounter.toString();

            newData.sessions.push({
              userId: tokens.userId,
              token: token
            });

            return {
              token: token
            };
          }
        }

      } else {
        data.numFailedPasswordsSinceLastLogin++;
        return {
          error: 'Password is not correct for the given email.'
        };
      }
    }
  }

  return {
    error: 'Email address does not exist.',
  };
}

/**
  * Gets the authUserId and if that matches a user updates their email or first name or last name
  * @param {string} token - The user's token for their session.
  * 
  * @returns {
  *   object {
  *      error: string
  *   }
  * } Error Object with information regarding the error.
  * @returns {user:} returns the user: object with the necessary values of the details returned.
*/
function adminUserDetails(token: string): ErrorObject | UserDetailsReturnObject {
  const data = getData();
  const findToken = data.sessions.find(sessions => sessions.token === token);

  if (!findToken) {
    return { error: 'Token invalid' };
  }

  const findUser = data.user.find(user => user.userId === findToken.userId);

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
  * Gets the authUserId and if that matches a user updates their email or first name or last name
  * parameter @ {int} authUserId - the id of the user we want to change
  * parameter @ { string } email - the email we want to update or keep
  * parameter @ { string } nameFirst - the first name of the user we want to change or  keep the same
  * parameter @ { string } nameLast - the last name of the user we want to change or keep the same
  * @returns  {string} if there is an error occurs error string returned
  * @returns  { } if function is succesful returns empty object
*/
function adminUserDetailsUpdate(token: string, email: string, nameFirst: string, nameLast: string): ErrorObject | EmptyObject {
  const data = getData();

  for (let i = 0; i < data.user.length; i++) {
    if (data.user[i].email === email) {
      return {
        error: 'Email is already in use.',
      };
    }
  }

  const sessionDetails = data.session.find(sessionId => sessionId.token === token);
  if (!(sessionDetails)) {
    return {
      error: 'Token is invalid.'
    }
  }
  const userId = sessionDetails.userId;
  const indexToUpdate = data.user.find(user => user.userId === userId);

  if (validator.isEmail(email) === false) {
    return {
      error: 'Invalid email.',
    };
  }

  if (!nameFirst.match(/^[A-Za-z'" -]+$/)) {
    return {
      error: 'Invalid characters in first name.',
    };
  }

  if (nameFirst.length < 2 || nameFirst.length > 20) {
    return {
      error: 'Invalid first name length.',
    };
  }

  if (!nameLast.match(/^[A-Za-z'" -]+$/)) {
    return {
      error: 'Invalid characters in last name.',
    };
  }

  if (nameLast.length < 2 || nameLast.length > 20) {
    return {
      error: 'Invalid last name length.',
    };
  }

  data.user[indexToUpdate].email = email;
  data.user[indexToUpdate].nameFirst = nameFirst;
  data.user[indexToUpdate].nameLast = nameLast;

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
  * @returns {
  *   object {
  *      error: string
  *   }
  * } Error Object with information regarding the error.
*/

function passwordChecker(userDetails: UserData, oldPassword: string, newPassword: string): ErrorObject {
  if (oldPassword === newPassword) {
    return {
      error: 'New Password is the same as old passward.'
    };
  }
  for (let i = 0; i < userDetails.passwordHistory.length; i++) {
    if (newPassword === userDetails.passwordHistory[i]) {
      return {
        error: 'Password has already been used before.'
      };
    }
  }
  if (newPassword.length < 8) {
    return {
      error: 'New Password must be at least 8 characters long.',
    };
  }

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
    return {
      error: 'New Password must have at least one number and one letter.'
    };
  }

  return {
    error: 'No Error'
  };
}

/**
  * adminUserPasswordUpdate takes in the user's current token, current password and the
  * password they want to change it to. If the current and new password passes
  * a series of error checks, their password will be changed and updated
  * and pushed onto the passwordHistory.
  *
  * This function does some preliminary error checking for
  *   1. Is the authId Valid
  *   2. Check if the inputted oldPassword is their correct current password
  * Afterwards, error checking for the new password is done in the helper function
  * passwordChecker.
  *
  * @param {integer} token - This is the user's token for their session.
  * @param {string} oldPassword - User's current password.
  * @param {string} newPassword - User's new password.
  *
  * @returns {
  *   object {
  *      error: string
  *   }
  * } Error Object with information regarding the error.
  * @returns {
  *   object {
  *
  *   }
  * } Empty Object to indicidate that everything worked.
  *
*/
function adminUserPasswordUpdate(token: string, oldPassword: string, newPassword: string): ErrorObject | EmptyObject {
  const data = getData();
  //Finding the token.
  const findToken = data.sessions.find(sessionId => sessionId.token === token);
  if (!(findToken)) {
    return {
      error: 'Token invalid'
    };
  }

  //Getting the userInfo
  const userInfo = data.user.find(id => id.userId === findToken.userId);

  //Checking if the current pass was entered correctly.
  if (oldPassword !== userInfo.password) {
    return {
      error: 'Password Entered Is Incorrect.'
    };
  }

  //Passing into Helper To Do The Rest of the Error Checks.  
  const newPassIsOk = passwordChecker(userInfo, oldPassword, newPassword);

  //Now checking the contents of the return.
  if (newPassIsOk.error !== 'No Error') {
    return newPassIsOk;
  } else {
    userInfo.passwordHistory.push(newPassword);
    userInfo.password = newPassword;
    return {};
  }
}

export {
  adminAuthLogin,
  adminAuthRegister,
  adminUserDetails,
  adminUserDetailsUpdate,
  adminUserPasswordUpdate,
};
