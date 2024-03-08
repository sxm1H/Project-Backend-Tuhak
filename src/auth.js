import { getData, setData } from './dataStore.js'
import validator from 'validator';

/**
  * <Given a registered user's email and password returns their authUserId value>.
  * 
  * @param {string} email - User email which may or not be registered
  * @param {string} password - Password that may or may not be correlated with specified email
  * 
  * @returns {object {authUserId: number}} returned ID if email and password correlates to registered user.
  * @returns {object {error: string}} returns specified error message
*/

function adminAuthLogin(email, password) {

  const newData = getData();

  for (const data of newData.user) {
    if (data.email === email) {
      if (data.password === password) {
        data.numFailedPasswordsSinceLastLogin = 0;
        data.numSuccessfulLogins++;
        return {
          authUserId: data.userId,
        }
      } else {
        data.numFailedPasswordsSinceLastLogin++;
        return { 
          error: 'Password is not correct for the given email.'
        }
      }
    }
  }

  return {
    error: 'Email address does not exist.',
  }
}

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
function adminAuthRegister(email, password, nameFirst, nameLast) {
  let newdata = getData();

  for (let i = 0; i < newdata.user.length; i++) {
    if (newdata.user[i].email === email) {
      return {
        error: 'Email is already in use.', 
      }
    }
  }

  if (validator.isEmail(email) === false) {
    return {
      error: 'Invalid email.',
    }
  }

  if (Boolean(nameFirst.match(/^[A-Za-z'" -]+$/)) === false) {
    return {
      error: 'Invalid characters in first name.',
    }
  }

  if (nameFirst.length < 2 || nameFirst.length > 20) {
    return {
      error: 'Invalid first name length.',
    }
  }

  if (Boolean(nameLast.match(/^[A-Za-z'" -]+$/)) === false) {
    return {
      error: 'Invalid characters in last name.',
    }
  }

  if (nameLast.length < 2 || nameLast.length > 20) {
    return {
      error: 'Invalid last name length.',
    }
  }

  if (password.length < 8) {
    return {
      error: 'Password must be at least 8 characters long.',
    }
  }

  if (Boolean(password.match(/[A-Za-z]/)) === false || 
      Boolean(password.match(/[0-9]/)) === false) {
    return {
      error: 'Password must have at least one number and one letter.',
    }
  }

  let id = newdata.user.length + 1;

  newdata.user.push({
    email: email,
    password: password,
    nameFirst: nameFirst,
    nameLast: nameLast,
    userId: id,
    passwordHistory: [password],
    numSuccessfulLogins: 1,
    numFailedPasswordsSinceLastLogin: 0,
  })
  
  return {
    authUserId: id,
  }
}
/**
  * Gets the authUserId and if that matches a user updates their email or first name or last name
  * parameter @ {int} authUserId - the id of the user we want to change 
  * @returns  {string} if there is an error occurs error string returned
  * @returns  {user:} returns the user: object with the necessary values of the details returned.
*/
function adminUserDetails(authUserId) {

  let data = getData();
 
  for (const j of data.user) {
    if (j.userId === authUserId) {
      return {
        user: {
          userId: j.userId,
          name: j.nameFirst + ' ' + j.nameLast,
          email: j.email,
          numSuccessfulLogins: j.numSuccessfulLogins  || 0,
          numFailedPasswordsSinceLastLogin: j.numFailedPasswordsSinceLastLogin ||  0,
        }
      };
    }
  }
  return { error: 'authUserId not a valid Id' };
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
function adminUserDetailsUpdate(authUserId, email, nameFirst, nameLast ) {
  let data = getData();

  if (!data.user) {
    data.user = [];
  }
  
  let indexToUpdate = data.user.findIndex(user => user.userId === authUserId);
 
  if (indexToUpdate < 0) {
    return {
      error: 'User not found.',
    };
  }

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
  data.user[indexToUpdate].name = nameFirst + ' ' + nameLast;

 return {

 }

}

function passwordChecker(userDetails, oldPassword, newPassword) {
  if (oldPassword === newPassword) {
    return {
      error: 'New Password is the same as old passward.'
    }
  }
  for (let i = 0; i < userDetails.passwordHistory.length; i++) {
    if (newPassword === userDetails.passwordHistory[i]) {
      return {
        error: 'Password has already been used before.'
      }
    }
  }
  if (newPassword.length < 8) {
    return {
      error: 'New Password must be at least 8 characters long.',
    }
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
    }
  }

  return {
    error: 'No Error'
  }
}

/**
  * adminUserPasswordUpdate takes in the user's Id, current password and the
  * password they want to change it to. If the current and new password passes 
  * a series of error checks, their password will be changed and updated
  * and pushed onto the passwordHistory.
  * 
  * @param {integer} authUserId - This is the user's id.
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
function adminUserPasswordUpdate(authUserId, oldPassword, newPassword) {
  let data = getData();
  if (authUserId < 1 || authUserId > data.user.length) {
    return {
      error: 'Auth User ID invalid'
    }
  }

  let userInfo = data.user[authUserId - 1];
  if (oldPassword !== userInfo.password) {
    return {
      error: 'Password Entered Is Incorrect.'
    }
  }

  let newPassIsOk = passwordChecker(userInfo, oldPassword, newPassword);

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

