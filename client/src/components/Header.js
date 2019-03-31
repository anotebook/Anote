import React from 'react';
import { Navbar, Nav, NavItem, Dropdown } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

// import PropTypes, { object } from 'prop-types';
import GoogleAuth from './GoogleAuth';

/* this component render the header for the app and is always fixed at top */
class Header extends React.Component {
  render() {
    return (
      <Navbar
        collapseOnSelect="true"
        expand="sm"
        className="Appheader"
        variant="light"
        fixed="top"
      >
        <div
          className={`container-fluid ${
            this.props.currentUser.loggedIn ? 'headerContainerlogged' : ''
          }`}
        >
          <LinkContainer to="/">
            <Navbar.Brand>
              <div className="AppBrand">
                <img
                  src="/favicon.ico"
                  alt="AppBrand"
                  className="d-inline-block mr-2"
                  width="30"
                  height="30"
                />
                <span>Anote</span>
              </div>
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="responsive-navbar-nav" />

          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <LinkContainer exact to="/">
                <Nav.Link className="ml-auto"> Home </Nav.Link>
              </LinkContainer>
              <LinkContainer exact to="/about">
                <Nav.Link className="ml-auto"> About </Nav.Link>
              </LinkContainer>
            </Nav>

            <Nav className="ml-auto">
              <NavItem
                id="FaUserIcon"
                className={
                  `ml-auto ${this.props.currentUser.loggedIn}`
                    ? 'visible'
                    : 'hidden'
                }
              >
                <FaUser />
              </NavItem>
              <Dropdown
                className={`${
                  this.props.currentUser.loggedIn ? 'visible' : 'hidden'
                } my-auto ml-auto ml-sm-2 d-flex flex-column align-items-end`}
              >
                <Dropdown.Toggle>User</Dropdown.Toggle>
                <Dropdown.Menu className="text-right text-sm-left">
                  <Dropdown.Item as={Link} to="/profile">
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/settings" disabled>
                    Settings
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <NavItem className="ml-auto ml-sm-2 mt-2 mt-sm-0">
                <GoogleAuth text="Sign in" />
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
    );
  }
}

export default Header;
