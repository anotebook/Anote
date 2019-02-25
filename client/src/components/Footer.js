import React from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { Navbar, Nav } from 'react-bootstrap';

/* this component render the footer and is only available for home page  */

class Footer extends React.Component {
  render() {
    return (
      <Navbar className="AppFooter" bg="dark" variant="dark">
        <Nav className="mr-auto">
          <Nav.Link href="./">@copyright</Nav.Link>
        </Nav>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Item>
              <Navbar.Text> Contact: </Navbar.Text>
            </Nav.Item>

            <Nav.Link href="#">
              <span className="contacts-details">
                {' '}
                <FaEnvelope />{' '}
              </span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Footer;
