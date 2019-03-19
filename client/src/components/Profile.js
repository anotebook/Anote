import React from 'react';
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import PropTypes from 'prop-types';

/* This component shows the Profile of the User */
class Profile extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      about: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      picture: PropTypes.string.isRequired,
      uid: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired
    }).isRequired
  };

  render() {
    let name = '';
    let email = '';
    let about = '';
    let picture = '';
    let username = '';
    if (this.props.user) {
      name = this.props.user.name;
      email = this.props.user.email;
      about = this.props.user.about;
      picture = this.props.user.picture;
      username = this.props.user.username;
    }

    return (
      <div className="d-flex flex-column justify-content-center align-items-center h-100">
        <Card id="profile-card" style={{ width: '60%' }}>
          <Card.Body>
            <Card.Title className="d-flex align-items-center">
              <img src={picture} alt="Profile" />
              <div className="m-0 ml-2">
                <h3>{name}</h3>
                <p className="text-muted">{about}</p>
              </div>
            </Card.Title>

            <ListGroup className="list-group-flush">
              <ListGroupItem>
                Email
                <br />
                <em>{email}</em>
              </ListGroupItem>
              <ListGroupItem>
                Username
                <br />
                <em>{username}</em>
              </ListGroupItem>
            </ListGroup>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default Profile;
