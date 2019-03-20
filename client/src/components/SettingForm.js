import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import axios from '../utils/axios';

/* this component shows the settings for the loggedIn User */
class SettingForm extends React.Component {
  updateSettings = e => {
    e.preventDefault();
    axios().post('/users/updateSetting', {
      userHandle: e.currentTarget.userHandle.value,
      fontSize: e.currentTarget.fontSize.value,
      fontColor: e.currentTarget.fontColor.value
    });

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
              Font_Size
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                name="userHandle"
                placeholder="userHandle"
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalsize">
            <Form.Label column sm={4}>
              Font_Size
            </Form.Label>
            <Col sm={8}>
              <Form.Control type="text" name="fontSize" placeholder="Size" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalcolor">
            <Form.Label column sm={4}>
              Font_Color
            </Form.Label>
            <Col sm={8}>
              <Form.Control type="text" name="fontColor" placeholder="Color" />
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

export default SettingForm;
