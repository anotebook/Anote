import React from 'react';
import { Card } from 'react-bootstrap';

/* This component shows the features available */
class About extends React.Component {
  render() {
    return (
      <Card>
        <Card.Body>
          <Card.Title>Anote</Card.Title>
          <Card.Text>
            <span>
              This is a simple note making app to keep yourself organised.
              <br />
              <br />
              Features Availabe:
            </span>
            <ul>
              <li>Notes</li>
              <li>Group Sharing</li>
              <li>X-list</li>
              <li>Templates</li>
              <li>Custom fonts</li>
              <li>More to be added</li>
            </ul>
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

export default About;
