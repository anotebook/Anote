import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

import axios from '../utils/axios';

// Component to create a note/folder
class CreateNote extends Component {
  static propTypes = {
    // It stores what is being created [note/folder]
    create: PropTypes.string.isRequired,
    // User's root folder
    userRootFolder: PropTypes.string.isRequired
  };

  state = {
    // Title of note/Name of folder
    title: ''
  };

  // Handle when user changes the title of the note
  handleTitleChange = text => {
    this.setState({
      title: text
    });
  };

  // When user clicks `create` button, send creation request to the server
  handleCreateNote = () => {
    const title = this.state.title;
    const locState = this.props.location.state;
    let from = null;
    if (locState) from = locState.from;
    let folder = this.props.userRootFolder;
    if (from && from.startsWith('/folders/open/')) {
      folder = from.substr(from.lastIndexOf('/') + 1);
    }
    axios()
      .post(`/${this.props.create}s/create`, {
        title,
        folder
      })
      .then(res => {
        const created = res.data;
        const route = `${this.props.create}s/open`;
        this.props.history.push(`/${route}/${created.id}`, { created });
      });
  };

  render() {
    /* console.log(this.props.location.state); */
    return (
      // Card to input the note's initial info
      <Card className="my-auto w-sm-75 mx-sm-auto">
        <Card.Header>Create {this.props.create}</Card.Header>
        <Card.Body>
          {/* Title for the note */}
          <Card.Title>
            <input
              placeholder="Title"
              value={this.state.title}
              onChange={e => this.handleTitleChange(e.target.value)}
              style={{ outline: 'none', border: 'none', width: '100%' }}
            />
          </Card.Title>
          {/* Create note button */}
          <Button
            onClick={this.handleCreateNote}
            style={{ float: 'right', marginTop: '1em' }}
          >
            Note it
          </Button>
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
