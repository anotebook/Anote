import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ListGroup,
  ListGroupItem,
  Modal,
  Button,
  InputGroup,
  FormControl,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import { FaRegListAlt } from 'react-icons/fa';
import { MdEdit, MdVisibility } from 'react-icons/md';

import axios from '../utils/axios';

class FolderSettings extends Component {
  static propTypes = {
    // Id of the content whose settings should be opened
    contentId: PropTypes.string.isRequired,
    // Store whose settings is to be update [folder/note]
    type: PropTypes.string.isRequired
  };

  state = {
    // Specifies if the x-list modal should be displayed
    xlistModal: false,
    // x-list for the content
    xlist: [],

    // Email of the new user to be added
    newEmail: '',
    // Visibility for new user to be added
    newVisibility: 0,

    // X-List query
    queryXList: '',
    // Array of x-list created by the user
    userXList: [],
    // Stores if x-list of the user have been created
    xListQueried: false,
    // Visibility for new x-list users to be added
    newXlistVisibility: 0
  };

  /*
   * Opens the modal displaying the xlist
   *
   * Makes the modal open and queries the access list of the contents
   */
  openXlist = () => {
    this.setState({ xlistModal: true });
    axios()
      .get(`/access/${this.props.type}s/${this.props.contentId}`)
      .then(res => {
        /* console.log(res.data); */
        this.setState({ xlist: res.data });
      });
  };

  // Closes the modal for x-list
  closeXlist = () => {
    this.setState({ xlistModal: false, userXList: [], xListQueried: false });
  };

  // Removes the access of the content from the user selected
  removeAccess = index => {
    axios()
      .post(
        `/access/${this.props.type}s/write/remove/${this.props.contentId}`,
        {
          email: [this.state.xlist[index].email]
        }
      )
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
        `/access/${this.props.type}s/${visibility ? 'write' : 'read'}/add/${
          this.props.contentId
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

  // Handle email change of new user being added to the content's x-list
  handleNewEmail = email => {
    this.setState({ newEmail: email });
  };

  // Handle visibilty change for new user being added to the content's x-list
  toggleNewVisibility = () => {
    this.setState(prevState => {
      return { newVisibility: (prevState.newVisibility + 1) % 2 };
    });
  };

  // Handle add request of the new user to content's x-list
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
          `/access/${this.props.type}s/${
            newVisibility ? 'write' : 'read'
          }/add/${this.props.contentId}`,
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
              newVisibility: 0
            };
          });
        });
    }
  };

  // Handles change in xlist's query
  handleXlistQuery = query => {
    this.setState({ queryXList: query });
    if (!this.state.xListQueried) {
      axios()
        .get('/xlist/me')
        .then(res =>
          this.setState({ userXList: res.data, xListQueried: true })
        );
    }
  };

  // Handles the visibility for the users added from x-list
  toggleNewXlistVisibility = () => {
    this.setState(prevState => {
      return { newXlistVisibility: (prevState.newXlistVisibility + 1) % 2 };
    });
  };

  // Adds the users from x-list to the access list of the content
  addXList = xlist => {
    const newVisibility = this.state.newXlistVisibility;
    axios()
      .post(
        `/access/${this.props.type}s/${newVisibility ? 'write' : 'read'}/add/${
          this.props.contentId
        }`,
        { email: [], xlist }
      )
      .then(() => {
        this.setState({ queryXList: '', newXlistVisibility: 0 });
        this.closeXlist();
      });
  };

  render() {
    return (
      <>
        <h3>Settings</h3>
        {/* Settings option for the content */}
        <ListGroup className="ml-2 mr-5">
          <ListGroupItem
            action
            onClick={this.openXlist}
            className="d-flex align-items-center"
          >
            <FaRegListAlt className="mr-2" />
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
                    <OverlayTrigger
                      delay={{ show: 250, hide: 200 }}
                      overlay={
                        <Tooltip>
                          {item.visibility ? 'Edit' : 'View only'}
                        </Tooltip>
                      }
                      placement="auto"
                    >
                      <Button
                        onClick={() => this.changeVisibilty(index)}
                        variant="outline-primary"
                      >
                        {item.visibility ? <MdEdit /> : <MdVisibility />}
                      </Button>
                    </OverlayTrigger>
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
            <InputGroup className="mt-2">
              {/* Email of new user */}
              <FormControl
                value={this.state.newEmail}
                onChange={e => this.handleNewEmail(e.target.value)}
                placeholder="Email"
                aria-label="Email"
              />
              {/* Visibility of new user */}
              <InputGroup.Append>
                <OverlayTrigger
                  delay={{ show: 250, hide: 200 }}
                  overlay={
                    <Tooltip>
                      {this.state.newVisibility ? 'Edit' : 'View only'}
                    </Tooltip>
                  }
                  placement="auto"
                >
                  <Button
                    onClick={this.toggleNewVisibility}
                    variant="outline-primary"
                  >
                    {this.state.newVisibility ? <MdEdit /> : <MdVisibility />}
                  </Button>
                </OverlayTrigger>
              </InputGroup.Append>
              {/* Add button for new user */}
              <InputGroup.Append>
                <Button onClick={this.addEmail}>Add</Button>
              </InputGroup.Append>
            </InputGroup>
            {/* Import users from x-list */}
            <>
              <InputGroup className="mt-2">
                {/* x-list's name */}
                <FormControl
                  value={this.state.queryXList}
                  onChange={e => this.handleXlistQuery(e.target.value)}
                  placeholder="X-List"
                  aria-label="X-List"
                />
                {/* Visibility of new user */}
                <InputGroup.Append>
                  <OverlayTrigger
                    delay={{ show: 250, hide: 200 }}
                    overlay={
                      <Tooltip>
                        {this.state.newXlistVisibility ? 'Edit' : 'View only'}
                      </Tooltip>
                    }
                    placement="auto"
                  >
                    <Button
                      onClick={this.toggleNewXlistVisibility}
                      variant="outline-primary"
                    >
                      {this.state.newXlistVisibility ? (
                        <MdEdit />
                      ) : (
                        <MdVisibility />
                      )}
                    </Button>
                  </OverlayTrigger>
                </InputGroup.Append>
              </InputGroup>
              {/* Show the x-list matches based on the query */}
              <ListGroup>
                {this.state.queryXList !== '' && // Don't show suggestions if no input
                  this.state.userXList
                    .filter(xlist => xlist.name.includes(this.state.queryXList))
                    // Show only 5 results
                    .slice(0, 5)
                    .map(xlist => {
                      return (
                        <ListGroupItem
                          key={xlist.name}
                          action
                          onClick={() => this.addXList(xlist.name)}
                        >
                          {xlist.name}
                        </ListGroupItem>
                      );
                    })}
              </ListGroup>
            </>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeXlist}>Done</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default FolderSettings;
