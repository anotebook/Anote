import React from 'react';
import { Jumbotron } from 'react-bootstrap';
import { FaCog } from 'react-icons/fa';

/* this component shows the settings for the loggedIn User */
class AppSetting extends React.Component {
  render() {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center h-100 app_theme">
        <Jumbotron style={{ margin: '125px' }}>
          <div className="d-flex">
            <FaCog className="d-inline-block FaUserSetting" />
            <h1>Settings</h1>
          </div>
          <p>
            Font Size:_ <br />
            Font Color:_ <br />
            Theme:_
          </p>
        </Jumbotron>
      </div>
    );
  }
}

export default AppSetting;
