import React from 'react';
import { Card } from 'react-bootstrap';
import GoogleAuth from './GoogleAuth';

/* this component shows the login message for the User */
const CardLogin = () => {
  return (
    <Card
      border="light"
      style={{ width: '350px', backgroundColor: '#cedfef', height: '30%' }}
      id="Login_Card"
    >
      <Card.Body>
        <Card.Title>PRS Notes</Card.Title>
        <Card.Text>Keep Yourself Organised</Card.Text>
        <GoogleAuth id="GoogleAuthBt" text="Sign in with Google" />
      </Card.Body>
    </Card>
  );
};

export default CardLogin;
