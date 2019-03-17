import React from 'react';
import { Card } from 'react-bootstrap';
import { FaHeart } from 'react-icons/fa';

/* This component shows the features available */
class About extends React.Component {
  render() {
    return (
      <Card id="about-card" style={{ width: '40%' }}>
        <Card.Body>
          <Card.Title>Anote</Card.Title>
          <Card.Text>
            This is a simple note making app to keep yourself organised.
            <br />
            <br />
            Made with <FaHeart style={{ color: 'red' }} /> by Praduman Kumar,
            Rishav Agarwal and Subham Agarwal
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

export default About;
