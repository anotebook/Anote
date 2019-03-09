import React from 'react';
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import { FaCog } from 'react-icons/fa';

/* this component shows the settings for the loggedIn User */
class AppSetting extends React.Component {
  render() {
    return (
      <div
        className="d-flex flex-column
          justify-content-center align-items-center h-100 w-75"
      >
        <Card style={{ width: '50%' }}>
          <Card.Body>
            <Card.Title className="d-flex align-items-center m-0">
              <FaCog className="d-inline-block" width="40" height="40" />
              <h1 className="m-0 ml-2">Settings</h1>
            </Card.Title>
          </Card.Body>
          <ListGroup className="list-group-flush">
            <ListGroupItem>
              Font Size
              <br />
              <em>12</em>
            </ListGroupItem>
            <ListGroupItem>
              Font Color
              <br />
              <em>Black</em>
            </ListGroupItem>
            <ListGroupItem>
              Theme
              <br />
              <em>Default</em>
            </ListGroupItem>
          </ListGroup>
        </Card>
      </div>
    );
  }
}

export default AppSetting;
