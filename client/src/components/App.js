import React, { Component } from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Footer from './Footer';
import Header from './Header';
import CardLogin from './CardLogin';
import About from './About';
import Profile from './Profile';
import AppSetting from './AppSetting';
import Scrollspy from './SideNavigation';
import toggleMenu from '../actions/toggleMenu';

import '../App.css';

/* A private routing component to redirect a user to login page if 
protected pages are accessed by Url or any mean */

function PrivateRoute({ component: Component1, loggedIn: loggedIn1, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        loggedIn1 ? (
          <Component1 {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/',
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
    loggedIn: false,
    menuDisp: false
  };

  static propTypes = {
    loggedIn: PropTypes.bool,
    menuDisp: PropTypes.bool,
    toggleMenu: PropTypes.func.isRequired
  };

  componentDidMount() {
    if (this.props.menuDisp === false && window.innerWidth >= 800)
      this.props.toggleMenu();

    const body = document.querySelector('body');

    if (window.innerWidth <= 576)
      body.style.width = `${250 * (this.props.menuDisp ? 1 : 0) +
        window.innerWidth}px`;
    else body.style.width = '100%';

    window.addEventListener('resize', this.eventListenerAction);
  }

  eventListenerAction = () => {
    const body = document.querySelector('body');

    if (window.innerWidth < 800 && this.props.menuDisp === true)
      this.props.toggleMenu();
    else if (window.innerWidth >= 800 && this.props.menuDisp === false)
      this.props.toggleMenu();

    if (window.innerWidth <= 576)
      body.style.width = `${250 * (this.props.menuDisp ? 1 : 0) +
        window.innerWidth}px`;
    else body.style.width = '100%';
  };

  render() {
    return (
      <div
        className={`d-flex flex-column h-100 ${
          this.props.loggedIn
            ? this.props.menuDisp === true
              ? 'main-content-with-menu-open'
              : 'main-content-with-menu-closed'
            : 'main-content-with-logged-out'
        }`}
      >
        {/* header file with username */}
        <Header currentUser={{ loggedIn: this.props.loggedIn }} />

        {/* render main-content i.e. Login Data/ Setting/ Profile Data */}

        {this.props.loggedIn && <Scrollspy />}

        <div className="main-content">
          <Switch>
            {/* render Login Message for User */}
            <Route exact path="/" component={CardLogin} />

            {/* render features of the App and how to use info */}
            <Route exact path="/about" component={About} />

            {/* render AppSettings and is valid for loggedIn User */}
            <PrivateRoute
              exact
              path="/settings"
              component={AppSetting}
              loggedIn={this.props.loggedIn}
            />

            {/* render User Info */}
            <PrivateRoute
              exact
              path="/profile"
              component={Profile}
              loggedIn={this.props.loggedIn}
            />
          </Switch>
        </div>

        {/* render copyright of the app and contacts details */}
        {!this.props.loggedIn && <Footer />}
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
    loggedIn: state.loggedIn,
    // If user has been verified by the server
    verified: state.verified,

    user: state.user,

    menu_disp: state.toggle_menu
  };
};

export default withRouter(
  connect(
    /* State */
    mapStateToProps,
    { toggleMenu }
  )(App)
);
