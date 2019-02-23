import React from 'react';
import { Jumbotron } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';
import PropTypes, { object } from 'prop-types';

/* This component shows the Profile of the User */

class Profile extends React.Component {
  static propTypes = {
    user: PropTypes.instanceOf(object).isRequired
  };

  render() {
    let name = '';
    if (this.props.user) name = this.props.user.name;

    return (
      <div className="d-flex flex-column justify-content-center align-items-center h-100 app_theme">
        <Jumbotron style={{ margin: '125px' }}>
          <div className="d-flex">
            <FaUser className="d-inline-block FaUserProfile" />
            <h2>Profile</h2>
          </div>

          <p>UserName: {name}</p>
        </Jumbotron>
      </div>
    );
  }
}

export default Profile;
