import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Form, Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from '../utils/axios';
import { changeAppSetting } from '../actions';

/* this component to take settings input and change the settings
 for the loggedIn User */

class SettingForm extends React.Component {
  static propTypes = {
    changeAppSetting: PropTypes.func.isRequired,
    setting: PropTypes.shape({
      fontColor: PropTypes.string.isRequired,
      fontSize: PropTypes.number.isRequired,
      userHandle: PropTypes.string.isRequired
    }).isRequired
  };

  updateSettings = e => {
    e.preventDefault();

    // update the app setting of the user in database
    axios().post('/users/updateSetting', {
      userHandle: e.currentTarget.userHandle.value,
      fontSize: Number(e.currentTarget.fontSize.value),
      fontColor: e.currentTarget.fontColor.value
    });

    // update app setting stored as redux state
    this.props.changeAppSetting({
      userHandle: e.currentTarget.userHandle.value,
      fontSize: Number(e.currentTarget.fontSize.value),
      fontColor: e.currentTarget.fontColor.value
    });

    // redirect back to setting route
    this.props.history.push('/settings/', {
      from: this.props.history.location.pathname
    });
  };

  render() {
    return (
      <div
        className="settingForm d-flex flex-column
           align-items-center h-100"
      >
        <Form onSubmit={this.updateSettings} autoComplete="off">
          <Row>
            <h3>Settings</h3>
          </Row>

          <Form.Group as={Row} controlId="formHorizontaluserHandle">
            <Form.Label column sm={4}>
              User_Handle
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                name="userHandle"
                defaultValue={this.props.setting.userHandle}
                maxLength="20"
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalsize">
            <Form.Label column sm={4}>
              Font_Size
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                name="fontSize"
                defaultValue={this.props.setting.fontSize}
                maxLength="2"
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalcolor">
            <Form.Label column sm={4}>
              Font_Color
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                name="fontColor"
                defaultValue={this.props.setting.fontColor}
                placeholder={this.props.setting.fontColor}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Col sm={{ span: 8, offset: 4 }}>
              {/* <input type="submit" value="Save" /> */}
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </div>
    );
  }
}

// Get the required props from the state
const mapStateToProps = state => {
  return {
    setting: state.setting
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    /* Action creators */
    {
      changeAppSetting
    }
  )(SettingForm)
);
