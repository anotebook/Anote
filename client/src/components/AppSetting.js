import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Card,
  ListGroup,
  ListGroupItem,
  Button,
  Row,
  Col
} from 'react-bootstrap';
import { FaCog } from 'react-icons/fa';
import { changeAppSetting } from '../actions';

/* this component shows the settings for the loggedIn User */
class AppSetting extends React.Component {
  static propTypes = {
    fontColor: PropTypes.string.isRequired,
    fontSize: PropTypes.number.isRequired,
    history: PropTypes.instanceOf(Object).isRequired
  };

  updateSettings = () => {
    // redirect to settings update form
    this.props.history.push('/settings/update', {
      from: this.props.history.location.pathname
    });
  };

  render() {
    return (
      <div
        className="d-flex flex-column
        justify-content-center align-items-center h-100"
      >
        <Card id="setting-card">
          <Card.Body
            style={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Card.Title className="d-flex align-items-center m-0">
              <FaCog className="d-inline-block" width="40" height="40" />
              <h1 className="m-0 ml-2">Settings</h1>
            </Card.Title>
            <br />
            <ListGroup className="list-group-flush">
              <ListGroupItem>
                <Row>
                  <Col sm={8}> Font Size</Col>
                  <Col sm={4}>
                    <em>{this.props.fontSize}</em>
                  </Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col sm={8}> Font Color</Col>
                  <Col sm={4}>
                    <em>{this.props.fontColor}</em>
                  </Col>
                </Row>
              </ListGroupItem>
              <ListGroupItem>
                <Row>
                  <Col sm={8}> Theme </Col>
                  <Col sm={4}>
                    <em> Default </em>
                  </Col>
                </Row>
              </ListGroupItem>
            </ListGroup>
            <Button
              className="btn-setting"
              variant="primary"
              onClick={this.updateSettings}
            >
              Update Settings
            </Button>
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
    fontSize: state.setting.fontSize,
    fontColor: state.setting.fontColor
  };
};

export default withRouter(
  connect(
    /* State */
    mapStateToProps,
    /* Action creators */
    {
      changeAppSetting
    }
  )(AppSetting)
);
