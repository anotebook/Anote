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
const verifyUser = async token => {
  // Verify the integrity of id token recieved
  /* If verification fails, it will throw an error
  which is then handled by the caller */
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.REACT_APP_GOOGLE_SIGNIN_CLIENT_ID
  });

  // Get the data after verification
  const payload = ticket.getPayload();

  // Verify the client id
  const clientId = payload.aud;
  if (clientId !== process.env.REACT_APP_GOOGLE_SIGNIN_CLIENT_ID) {
    // If client id didn't match, create authentication error
    throw new Error('Authentication error!');
  }

  // By this time, user has been verified!
  // Return the user data
  return {
    uid: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture
  };
};

module.exports = verifyUser;
