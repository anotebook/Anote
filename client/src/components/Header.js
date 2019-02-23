import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

// import PropTypes, { object } from 'prop-types';

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import GoogleAuth from './GoogleAuth';

/* this component render the header for the app and is always fixed at top */
class Header extends React.Component {
  static propTypes = {};

  render() {
    console.log(this.props.currentUser);
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

              <UncontrolledDropdown
                nav
                inNavbar
                className={
                  this.props.currentUser.loggedIn ? 'visible' : 'hidden'
                }
              >
                <DropdownToggle nav caret>
                  User
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem tag={Link} to="/profile">
                    Profile
                  </DropdownItem>
                  <DropdownItem tag={Link} to="/settings">
                    Settings
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>

              <NavItem>
                <GoogleAuth id="no_css" text="Sign in" />
              </NavItem>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
    );
  }
}

export default Header;
