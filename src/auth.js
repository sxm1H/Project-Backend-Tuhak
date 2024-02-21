// Sample stub for the authLoginV1 function
// Return stub value matches table below
function adminAuthLogin(email, password) {
  return {
    authUserId: 1,
  }
}

function adminAuthRegister(email, password, nameFirst, nameLast) {
  return {
    authUserId: 1,
  }
<<<<<<< src/auth.js
}

=======
>>>>>>> src/auth.js
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
<<<<<<< src/auth.js

function adminUserDetailsUpdate(authUserId, email, nameFirst, nameLast ) {
  return{
    
  };
}
=======
>>>>>>> src/auth.js
