import { getData, setData } from './dataStore.js'
import validator from 'validator';

// Sample stub for the authLoginV1 function
// Return stub value matches table below
function adminAuthLogin(email, password) {

  const newData = getData();

  for (const data of newData.user) {
    if (data.email === email) {
      if (data.password === password) {
        return {
          authUserId: data.userId,
        }
      } else {
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

  if (Boolean(nameFirst.match(/^[A-Za-z'"\x-]+$/)) === false) {
    return {
      error: 'Invalid characters in first name.',
    }
  }

  if (nameFirst.length < 2 || nameFirst.length > 20) {
    return {
      error: 'Invalid first name length.',
    }
  }

  if (Boolean(nameLast.match(/^[A-Za-z'"\x-]+$/)) === false) {
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
  return {
      user: {
          userId: 1,
          name: 'Hayden Smith',
          email: 'hayden.smith@unsw.edu.au',
          numSuccessfulLogins: 3,
          numFailedPasswordsSinceLastLogin: 1,
      },
  };
}  

function adminUserDetailsUpdate(authUserId, email, nameFirst, nameLast ) {
  return {
    
  };
}
function adminUserPasswordUpdate(authUserId, oldPassword, newPassword ) {
  return {

  };
}


export {
  adminAuthLogin, 
  adminAuthRegister,
  adminUserDetails,
  adminUserDetailsUpdate,
  adminUserPasswordUpdate,
 };

