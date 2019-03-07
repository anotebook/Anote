import React from 'react';
import { connect } from 'react-redux';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import About from './About';

import {
  changeLoginState,
  changeVerifyState,
  changeUserData
} from '../actions';

/* Component which handles all the task required for user signin/logout */
class GoogleAuth extends React.Component {
  static propTypes = {
    changeLoginState: PropTypes.func.isRequired,
    changeUserData: PropTypes.func.isRequired,
    changeVerifyState: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
    verified: PropTypes.bool.isRequired
  };

  /* If user couldn't be verified by the server,
   this function is called to logout the user */
  logout = () => {
    const auth2 = window.gapi.auth2.getAuthInstance();
    if (auth2 != null) {
      auth2.signOut().then(this.onLogoutSuccess);
    }
  };

  // If login is successful, this function is called
  onLoginSuccess = googleRes => {
    // User signed in sucessfully, change login state to `true`
    this.props.changeLoginState(true);
    this.props.changeVerifyState(true);
    /* this.props.changeUserData( googleRes.profileObj ); */

    // After successful login, verify the user by the server
    // by sending the user's id token recieved by Google

    axios
      .post('/api/v1/createUser', {
        id_token: googleRes.getAuthResponse().id_token
      })
      .then(res => {
        // Verification successful! Update state and user data
        this.props.changeVerifyState(true);
        this.props.changeUserData(res.data);

        this.props.history.push('/profile');
      })
      .catch(() => {
        // Verification error!(Either mongodb or token verification)
        this.props.changeVerifyState(false);
        this.props.changeUserData(null);
        // Since verification failed, logout the user from the app
        this.logout();
      });
  };

  // If login fails, this function is called
  onLoginFailure = () => {
    // Sign in error, set login state to `false`
    this.props.changeLoginState(false);
    this.props.changeUserData(null);
  };

  // If logout is successful, this function is called
  onLogoutSuccess = () => {
    // Logout successful, change login state to `false`
    this.props.changeLoginState(false);
    this.props.changeUserData(null);
    this.props.history.push('/');
  };

  render() {
    return (
      /* Signin/logout button */
      <div>
        {/*
         * If user is logged in as well as verified, show the logout button
         * If user is logged in but not verified, show please wait button
         * If user is not logged in, show sign in button
         */}
        {this.props.loggedIn ? (
          // User has logged in
          this.props.verified ? (
            // User logged in as well as verified, show logout button
            <GoogleLogout
              buttonText="Logout"
              onLogoutSuccess={this.onLogoutSuccess}
              // Custom logout buton design
              render={renderProps => (
                <Button
                  variant="danger"
                  onClick={renderProps.onClick}
                  className="m-1"
                >
                  Log Out
                </Button>
              )}
            />
          ) : (
            // User logged in but not verified, show please wait button
            <About />
          )
        ) : (
          // If user is not logged in, show the sign in button
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_SIGNIN_CLIENT_ID}
            onSuccess={this.onLoginSuccess}
            onFailure={this.onLoginFailure}
            // If user is signed in, call `onSuccess`
            isSignedIn={true}
            // Custom sign in buton design
            render={renderProps => (
              <Button
                variant="primary"
                onClick={renderProps.onClick}
                className="m-1"
              >
                {this.props.text}
              </Button>
            )}
          />
        )}
      </div>
    );
  }
}

// Get the required props from the state
const mapStateToProps = state => {
  return {
    // If user is logged in
    loggedIn: state.loggedIn,
    // If user is verified by the server
    verified: state.verified
  };
};

export default withRouter(
  connect(
    /* State */
    mapStateToProps,
    /* Action creators */
    {
      changeLoginState,
      changeVerifyState,
      changeUserData
    }
  )(GoogleAuth)
);
