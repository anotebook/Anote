import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Card, Button, InputGroup, FormControl } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FaFolder, FaStickyNote } from 'react-icons/fa';

import axios from '../utils/axios';

// Component to create a note/folder
class CreateNote extends Component {
  static propTypes = {
    // It stores what is being created [note/folder]
    create: PropTypes.oneOf(['note', 'folder']).isRequired,
    history: PropTypes.instanceOf(Object).isRequired,
    location: PropTypes.instanceOf(Object).isRequired,
    // User's root folder
    userRootFolder: PropTypes.string.isRequired
  };

  state = {
    // Title of note/Name of folder
    title: '',
    // Contains the error msg for the title
    error: ''
  };

  // Focus the title of the note/folder input field
  componentDidMount = () => {
    this.refs.contentTitle.focus();
  };

  // Handle when user changes the title of the note
  handleTitleChange = text => {
    this.setState({
      title: text,
      error: ''
    });
  };

  // When user clicks `create` button, send creation request to the server
  handleCreateNote = () => {
    // Get the content's title
    const title = this.state.title.trim();

    // If we have folder and its name is empty return showing the error
    if (this.props.create === 'folder' && title.length === 0) {
      this.setState({
        error: 'Folder name cannot be empty'
      });
      return;
    }
    // If folder's name is not empty or we have note, clear error and continue
    this.setState({ error: '' });

    let isNameValid = true;
    // Check if the folder's and note's(if given) name matches the requirements
    if (!(this.props.create === 'note' && title.length === 0))
      isNameValid =
        /^[a-zA-Z][-\w ]*$/.test(title) &&
        title !== 'root' &&
        (this.props.create === 'folder' ? title.length <= 21 : true);
    // Update the validation status
    this.setState({
      error: `${
        isNameValid
          ? ''
          : 'Name should be of less than 22 characters. Name cannot be "root". Name should start with an alphabet and ' +
            'can only contain alphanumeric characters, underscores and hyphens'
      }`
    });
    // If error occurs, return showing the error
    if (!isNameValid) return;

    const locState = this.props.location.state;
    // Set the parent folder to location state's parent if found,
    // Else fallback to user's root folder
    const folder =
      locState && locState.parent ? locState.parent : this.props.userRootFolder;

    // Send create note/folder request
    axios()
      .post(`/${this.props.create}s/create`, {
        title,
        folder
      })
      .then(res => {
        const created = res.data;
        const route = `${this.props.create}s/open`;
        this.props.history.replace(`/${route}/${created.id}`, { created });
      })
      .catch(err => {
        if (err.response) this.setState({ error: err.response.data.reason });
      });
  };

  render() {
    /* console.log(this.props.location.state); */
    return (
      // Card to input the note's initial info
      <Card className="my-auto w-sm-75 mx-sm-auto">
        <Card.Header>
          <span className="d-flex align-items-center">
            {this.props.create === 'folder' ? <FaFolder /> : <FaStickyNote />}
            <span className="ml-2">Create {this.props.create}</span>
          </span>
        </Card.Header>
        <Card.Body>
          {/* Title for the note */}
          <Card.Title>
            <InputGroup>
              <FormControl
                ref="contentTitle"
                placeholder="Title"
                value={this.state.title}
                onChange={e => this.handleTitleChange(e.target.value)}
              />
              <InputGroup.Append>
                {/* Create note button */}
                <Button onClick={this.handleCreateNote}>Note it</Button>
              </InputGroup.Append>
            </InputGroup>
            <span
              className={`validation-error ${
                this.state.error ? 'd-block' : 'd-none'
              }`}
            >
              {this.state.error}
            </span>
          </Card.Title>
        </Card.Body>
      </Card>
    );
  }
}

// Get the required props from the state
const mapStateToProps = state => {
  return {
    userRootFolder: state.user.root
  };
};

export default withRouter(connect(mapStateToProps)(CreateNote));
