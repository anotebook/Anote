import { OAuth2Client } from 'google-auth-library';

// Get OAuth client for server verification of the user
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_SIGNIN_CLIENT_ID);

/*
 * Verify user when one tries to connect to the app
 *
 * This is done by-
 * 1. Verifying the integrity of id token
 * 2. Match the client id from the token with our provided client id
 */
const verifyUser = token => {
  // Verify the integrity of id token recieved
  /* If verification fails, it will throw an error
  which is then handled by the caller */
  return client
    .verifyIdToken({
      idToken: token,
      audience: process.env.REACT_APP_GOOGLE_SIGNIN_CLIENT_ID
    })
    .catch(() => {
      throw Object({ code: 400, reason: 'Authentication failed!' });
    })
    .then(ticket => {
      // Get the data after verification
      const payload = ticket.getPayload();

      // Verify the client id
      const clientId = payload.aud;
      // If client id didn't match, create authentication error
      if (clientId !== process.env.REACT_APP_GOOGLE_SIGNIN_CLIENT_ID)
        throw Object({ code: 400, reason: 'Authentication failed!' });

      // By this time, user has been verified!
      // Return the user data
      return {
        uid: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      };
    });
};

export default verifyUser;
