import React from 'react';
import {
  Card,
  ListGroup,
  ListGroupItem,
  Button,
  Row,
  Col
} from 'react-bootstrap';
import { FaCog } from 'react-icons/fa';

/* this component shows the settings for the loggedIn User */
class AppSetting extends React.Component {
  updateSettings = () => {
    this.props.history.push('/settings/update', {
      from: this.props.history.location.pathname
    });
  };

  render() {
    return (
      <div
        className="d-flex flex-column
          justify-content-center align-items-center h-100 w-75"
      >
        <Card id="setting-card" style={{ width: '50%' }}>
          <Card.Body>
            <Card.Title className="d-flex align-items-center m-0">
              <FaCog className="d-inline-block" width="40" height="40" />
              <h1 className="m-0 ml-2">Settings</h1>
            </Card.Title>
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
            <Row>
              <Col sm={{ span: 8, offset: 4 }}>
                <Button variant="primary" onClick={this.updateSettings}>
                  Update Settings
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default AppSetting;
