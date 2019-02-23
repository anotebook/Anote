import React from 'react';
import { Jumbotron, Container } from 'react-bootstrap';

/* This component shows the features available */
class About extends React.Component {
  render() {
    return (
      <Jumbotron fluid style={{ backgroundColor: '#F0F8FF' }}>
        <Container>
          <h1>ANote</h1>
          <span>
            This is a note making app. Features Availabe:
            <ul>
              <li>Notes</li>
              <li>Group Sharing</li>
              <li>Xlist</li>
              <li>Template</li>
              <li>Custom Font-Setting</li>
              <li>To be Added</li>
            </ul>
          </span>
        </Container>
      </Jumbotron>
    );
  }
}

export default About;
