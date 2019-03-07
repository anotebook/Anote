import React from 'react';
import { Navbar, Nav, NavItem, Dropdown } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

// import PropTypes, { object } from 'prop-types';
import GoogleAuth from './GoogleAuth';

/* this component render the header for the app and is always fixed at top */
class Header extends React.Component {
  static propTypes = {};

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
          <LinkContainer to="./about">
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
              <LinkContainer activeStyle={{ color: 'red' }} to="./">
                <Nav.Link> Home </Nav.Link>
              </LinkContainer>
            </Nav>

            <Nav className="ml-auto">
              <NavItem
                id="FaUserIcon"
                className={
                  this.props.currentUser.loggedIn ? 'visible' : 'hidden'
                }
              >
                <FaUser />
              </NavItem>

              {/* <NavDropdown title="User" id="collasible-nav-dropdown"
               className={this.props.currentUser.loggedIn?"visible":"hidden"} >
                <NavDropdown.Item href="/" >pk</NavDropdown.Item>
                <Link to="/profile" className="dropdown-item" role="button">
                   Profile</Link>
                <Link to="/settings" className="dropdown-item" >Settings </Link>
                </NavDropdown> */}

              <Dropdown
                className={
                  this.props.currentUser.loggedIn ? 'visible' : 'hidden'
                }
              >
                <Dropdown.Toggle>User</Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/profile">
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/settings">
                    Settings
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <NavItem>
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
