import React, { Component } from 'react';
import {
  Card,
  InputGroup,
  Dropdown,
  DropdownButton,
  Button,
  ListGroup
} from 'react-bootstrap';

import axios from '../utils/axios';

// Component to create a note
// It asks for note's title and its visibilty to create a note
class CreateNote extends Component {
  state = {
    title: '',
    visibility: 0
  };

  // 3 types of visibility possible
  mapVisibleValueToString = ['Private', 'View only', 'Public'];

  // Handle when user changes the visibilty of the note
  handleVisibilityChange = selected => {
    this.setState({
      visibility: selected
    });
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
    const visibility = this.state.visibility;
    axios().post('/create-note', {
      title,
      visibility,
      folder: this.props.location.pathname,
      timestamp: Date.now()
    });
  };

  render() {
    return (
      // Card to input the note's initial info
      <Card className="my-auto w-sm-75 mx-sm-auto">
        <Card.Header>Create note</Card.Header>
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
          <ListGroup>
            {/* Visibility of the note */}
            <ListGroup.Item>
              <InputGroup
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <span className="my-auto">Visibility</span>
                <DropdownButton
                  alignRight
                  title={this.mapVisibleValueToString[this.state.visibility]}
                  ref="visibility"
                >
                  <Dropdown.Header>Select visibility</Dropdown.Header>
                  <Dropdown.Item onClick={() => this.handleVisibilityChange(0)}>
                    Private
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => this.handleVisibilityChange(1)}>
                    View only
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => this.handleVisibilityChange(2)}>
                    Public
                  </Dropdown.Item>
                </DropdownButton>
              </InputGroup>
            </ListGroup.Item>
          </ListGroup>
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

export default CreateNote;
