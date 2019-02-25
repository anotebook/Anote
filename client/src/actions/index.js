/* ACTION-CREATORS */

// When user signs in/logs out
export const changeLoginState = loggedIn => {
  return {
    type: 'CHANGE_LOGIN',
    // New login state
    payload: {
      loggedIn
    }
  };
};

// When user is verified by server
export const changeVerifyState = verified => {
  return {
    type: 'CHANGE_VERIFY',
    // New verification state
    payload: {
      verified
    }
  };
};

// When we get user data from the server
export const changeUserData = user => {
  return {
    type: 'CHANGE_USER',
    // New user data
    payload: {
      user
    }
  };
};

// // action for signing in user
// export const SingInUser = loggedIn => {
//     return {
//       type: 'SIGNIN_IN',
//       payload: {
//         loggedIn
//       }
//     };
//   };

// // action for signing out user
//   export const SingOutUser = loggedIn => {
//     return {
//       type: 'SIGNIN_OUT',
//       payload: {
//       }
//     };
//   };

//   // action for verifying user on server side
//   export const changeVerifyState = verified => {
//     return {
//       type: 'CHANGE_VERIFY',
//       payload: {
//         verified
//       }
//     };
//   };
