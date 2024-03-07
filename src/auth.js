import { getData, setData } from './dataStore.js'
import validator from 'validator';

// Sample stub for the authLoginV1 function
// Return stub value matches table below
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
let countUserId = 0
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

