import React, { Component } from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Header from './Header';
import CardLogin from './CardLogin';
import About from './About';
import Profile from './Profile';
import Scrollspy from './Scrollspy';
import NoteContainer from './NoteContainer';
import Xlist from './xlist';
import Shared from './shared';
import SettingForm from './SettingForm';
import AppSetting from './AppSetting';

import toggleMenu, { widthChanged } from '../actions/toggleMenu';

import '../App.css';

/* A private routing component to redirect a user to login page if
protected pages are accessed by Url or any mean */
function PrivateRoute({
  component: Component1,
  isLoggedIn: isLoggedIn1,
  componentProps,
  ...rest
}) {
  PrivateRoute.propTypes = {
    component: PropTypes.func.isRequired,
    componentProps: PropTypes.instanceOf(Object),
    isLoggedIn: PropTypes.bool.isRequired
  };

  PrivateRoute.defaultProps = {
    componentProps: {}
  };

  return (
    <Route
      {...rest}
      render={props =>
        isLoggedIn1 ? (
          <Component1 {...props} {...componentProps} />
        ) : (
          <Redirect
            to={{
              pathname: '/',
              // eslint-disable-next-line react/prop-types
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

class App extends Component {
  static defaultProps = {
    isLoggedIn: false
  };

  static propTypes = {
    isLoggedIn: PropTypes.bool,
    isMenuDisp: PropTypes.bool.isRequired,
    toggleMenu: PropTypes.func.isRequired,
    user: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      about: PropTypes.string,
      email: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      picture: PropTypes.string.isRequired,
      root: PropTypes.string.isRequired,
      uid: PropTypes.string.isRequired,
      userHandle: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired
    }),
    widthChanged: PropTypes.func.isRequired
  };

  static defaultProps = {
    user: {}
  };

  componentDidMount() {
    if (this.props.isMenuDisp === false && window.innerWidth >= 800)
      this.props.toggleMenu();

    const body = document.querySelector('body');

    if (window.innerWidth <= 576)
      body.style.width = `${250 * (this.props.isMenuDisp ? 1 : 0) +
        window.innerWidth}px`;
    else body.style.width = '100%';

    window.addEventListener('resize', this.eventListenerAction);
  }

  eventListenerAction = () => {
    const body = document.querySelector('body');
    this.props.widthChanged();

    if (window.innerWidth < 800 && this.props.isMenuDisp === true)
      this.props.toggleMenu();
    else if (window.innerWidth >= 800 && this.props.isMenuDisp === false)
      this.props.toggleMenu();

    if (window.innerWidth <= 576)
      body.style.width = `${250 * (this.props.isMenuDisp ? 1 : 0) +
        window.innerWidth}px`;
    else body.style.width = '100%';
  };

  render() {
    if (
      process.env.NODE_ENV === 'production' &&
      window.location.href.includes('http://')
    ) {
      const url = `https://${window.location.href.split('http://')[1]}`;
      window.location.href = url;
    }

    return (
      <div
        className={`d-flex flex-column h-100 ${
          this.props.isLoggedIn
            ? this.props.isMenuDisp === true
              ? 'main-content-with-menu-open'
              : 'main-content-with-menu-closed'
            : 'main-content-with-logged-out'
        }`}
      >
        {/* header file with username */}
        <Header currentUser={{ loggedIn: this.props.isLoggedIn }} />

        {/* render main-content i.e. Login Data/ Setting/ Profile Data */}

        {/* Show side nav is user is logged in */}
        {this.props.isLoggedIn && <Scrollspy />}

        {/* Main content */}
        <div className="main-content">
          <Switch>
            {/* Put all the Routes here
             and all the PrivateRoutes at the bottom */}
            {/* render Login Message for User */}
            <Route exact path="/" component={CardLogin} />
            {/* render features of the App and how to use info */}
            <Route exact path="/about" component={About} />
            {/* Start PrivateRoutes from here */}
            {/* Show notes w/ associated functions to the user */}
            <PrivateRoute
              path="/notes"
              component={NoteContainer}
              isLoggedIn={this.props.isLoggedIn}
              componentProps={{ create: 'note' }}
            />
            {/* Show folder w/ associated functions to the user */}
            <PrivateRoute
              path="/folders"
              component={NoteContainer}
              isLoggedIn={this.props.isLoggedIn}
              componentProps={{ create: 'folder' }}
            />
            {/* // To be enabled later */}
            <PrivateRoute
              exact
              path="/settings/update"
              component={SettingForm}
              isLoggedIn={this.props.isLoggedIn}
            />
            {/* // render AppSettings and is valid for isLoggedIn User */}
            <PrivateRoute
              exact
              path="/settings"
              component={AppSetting}
              isLoggedIn={this.props.isLoggedIn}
            />
            {/* render User Info */}
            <PrivateRoute
              exact
              path="/profile"
              component={Profile}
              componentProps={{ user: this.props.user }}
              isLoggedIn={this.props.isLoggedIn}
            />
            <PrivateRoute
              path="/xlist"
              component={Xlist}
              isLoggedIn={this.props.isLoggedIn}
            />
            <PrivateRoute
              path="/shared"
              component={Shared}
              isLoggedIn={this.props.isLoggedIn}
            />
          </Switch>
        </div>
      </div>
    );
  }
}

// Get the required props from the state
const mapStateToProps = state => {
  // let user=null;
  // if(state.user) user=state.user;
  return {
    // If user is logged in
    isLoggedIn: state.loggedIn,
    // If user has been verified by the server
    verified: state.verified,

    user: state.user,

    isMenuDisp: state.toggleMenu
  };
};

export default withRouter(
  connect(
    /* State */
    mapStateToProps,
    { toggleMenu, widthChanged }
  )(App)
);
