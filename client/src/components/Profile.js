import React from 'react';
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

/* This component shows the Profile of the User */
class Profile extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      about: PropTypes.string,
      email: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      picture: PropTypes.string.isRequired,
      root: PropTypes.string.isRequired,
      setting: PropTypes.instanceOf(Object),
      uid: PropTypes.string.isRequired,
      userHandle: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired
    }).isRequired
  };

  render() {
    let name = '';
    let email = '';
    let about = '';
    let picture = '';
    if (this.props.user) {
      name = this.props.user.name;
      email = this.props.user.email;
      about = this.props.user.about;
      picture = this.props.user.picture;
    }

    return (
      <div className="d-flex flex-column justify-content-center align-items-center h-100">
        <Card id="profile-card">
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
                <h5>User handle</h5>
                <em>{this.props.user.userHandle}</em>
              </ListGroupItem>
              <ListGroupItem>
                <h5>Email</h5>
                <em>{email}</em>
              </ListGroupItem>
            </ListGroup>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

// Get the required props from the state
const mapStateToProps = state => {
  return {
    // get user settings
    user: state.user
  };
};

export default withRouter(
  connect(
    /* State */
    mapStateToProps,
    /* Action creators */
    {}
  )(Profile)
);
