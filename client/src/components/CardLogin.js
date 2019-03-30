import React from 'react';
import { Card } from 'react-bootstrap';
import GoogleAuth from './GoogleAuth';

/* this component shows the login message for the User */
const CardLogin = () => {
  return (
    <Card id="login-card">
      <Card.Body
        style={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Card.Title>Anote</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Keep yourself organised
        </Card.Subtitle>
        <Card.Text>
          Anote is one of the best and simple notes keeping app to keep yourself
          organised.
        </Card.Text>
        <GoogleAuth text="Sign in with Google" />
      </Card.Body>
    </Card>
  );
};

export default CardLogin;
