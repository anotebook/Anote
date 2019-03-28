import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ListGroup,
  ListGroupItem,
  Modal,
  Button,
  InputGroup,
  FormControl
} from 'react-bootstrap';
import { MdEdit, MdVisibility } from 'react-icons/md';

import axios from '../utils/axios';

class FolderSettings extends Component {
  static propTypes = {
    // Id of the folder whose settings should be opened
    folderId: PropTypes.string.isRequired
  };

  state = {
    // Specifies if the x-list modal should be displayed
    xlistModal: false,
    // x-list for the folder
    xlist: [],

    // Email of the new user to be added
    newEmail: '',
    // Visibility for new user to be added
    newVisibility: 0
  };

  /*
   * Opens the modal displaying the xlist
   *
   * Makes the modal open and queries the access list of the folder
   */
  openXlist = () => {
    this.setState({ xlistModal: true });
    axios()
      .get(`/access/folders/${this.props.folderId}`)
      .then(res => {
        /* console.log(res.data); */
        this.setState({ xlist: res.data });
      });
  };

  // Closes the modal for x-list
  closeXlist = () => {
    this.setState({ xlistModal: false });
  };

  // Removes the access of the folder from the user selected
  removeAccess = index => {
    axios()
      .post(`/access/folders/write/remove/${this.props.folderId}`, {
        email: [this.state.xlist[index].email]
      })
      .then(() => {
        // On successful removel, update the UI
        this.setState(prevState => {
          prevState.xlist.splice(index, 1);
          return { xlist: prevState.xlist };
        });
      });
  };

  // Changes the visibility of already existing user
  changeVisibilty = index => {
    const visibility = (this.state.xlist[index].visibility + 1) % 2;
    axios()
      .post(
        `/access/folders/${visibility ? 'write' : 'read'}/add/${
          this.props.folderId
        }`,
        { email: [this.state.xlist[index].email] }
      )
      .then(() => {
        // On success, update the UI
        this.setState(prevState => {
          prevState.xlist[index].visibility = visibility;
          return { xlist: prevState.xlist };
        });
      });
  };

  // Handle email change of new user being added to the folder's x-list
  handleNewEmail = email => {
    this.setState({ newEmail: email });
  };

  // Handle visibilty change for new user being added to the folder's x-list
  toggleNewVisibility = () => {
    this.setState(prevState => {
      return { newVisibility: (prevState.newVisibility + 1) % 2 };
    });
  };

  // Handle add request of the new user to folder's x-list
  addEmail = () => {
    const newVisibility = this.state.newVisibility;
    const newEmail = this.state.newEmail;
    // Check if entered email is valid (in terms of syntax)
    const regEmail = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/;
    const isEmailValid = regEmail.test(newEmail);
    // If email is valid, send the request
    if (isEmailValid) {
      axios()
        .post(
          `/access/folders/${newVisibility ? 'write' : 'read'}/add/${
            this.props.folderId
          }`,
          { email: [newEmail] }
        )
        .then(() => {
          // On succcessful addition, update the UI
          this.setState(prevState => {
            prevState.xlist.push({
              email: newEmail,
              visibility: newVisibility
            });
            return {
              xlist: prevState.xlist,
              newEmail: '',
              visibility: 0
            };
          });
        });
    }
  };

  render() {
    return (
      <>
        {/* Settings option for the folder */}
        <ListGroup>
          <ListGroupItem action onClick={this.openXlist}>
            X-List
          </ListGroupItem>
        </ListGroup>
        {/* Modal for X-list controlling */}
        <Modal show={this.state.xlistModal} onHide={this.closeXlist}>
          <Modal.Header>
            <Modal.Title>X-List</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* List of users having the access */}
            <ListGroup className="mb-3">
              {this.state.xlist.map((item, index) => (
                <ListGroupItem
                  key={item.email}
                  className="d-flex justify-content-between"
                >
                  {/* Email of the user */}
                  <span>{item.email}</span>
                  {/* Options for the user */}
                  <div className="d-flex">
                    {/* Visibility changing option */}
                    <Button
                      onClick={() => this.changeVisibilty(index)}
                      variant="outline-primary"
                    >
                      {item.visibility ? <MdEdit /> : <MdVisibility />}
                    </Button>
                    {/* Remove access button */}
                    <button
                      type="button"
                      className="close p-2"
                      aria-label="Close"
                      onClick={() => this.removeAccess(index)}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                </ListGroupItem>
              ))}
            </ListGroup>
            {/* New user input form */}
            <InputGroup>
              {/* Email of new user */}
              <FormControl
                value={this.state.newEmail}
                onChange={e => this.handleNewEmail(e.target.value)}
                placeholder="Email"
                aria-label="Email"
              />
              {/* Visibility of new user */}
              <InputGroup.Append>
                <Button
                  onClick={this.toggleNewVisibility}
                  variant="outline-primary"
                >
                  {this.state.newVisibility ? <MdEdit /> : <MdVisibility />}
                </Button>
              </InputGroup.Append>
              {/* Add button for new user */}
              <InputGroup.Append>
                <Button onClick={this.addEmail}>Add</Button>
              </InputGroup.Append>
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-danger" onClick={this.closeXlist}>
              Cancel
            </Button>
            <Button onClick={this.closeXlist}>Done</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default FolderSettings;
