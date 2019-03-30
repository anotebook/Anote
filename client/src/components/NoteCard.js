import React, { Component } from 'react';
import { Card, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

import getTimeDiff from '../utils/getTimeDifference';

// Custom card to display a note/template
class NoteCard extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    type: PropTypes.string.isRequired,
    updated: PropTypes.number,
    visibility: PropTypes.number.isRequired
  };

  static defaultProps = {
    title: ''
  };

  static defaultProps = {
    updated: 'Just now'
  };

  render() {
    // TODO: Update card design acc to the type(note/folder)
    return (
      <Card id={this.props.id} style={{ cursor: 'pointer' }}>
        <Card.Body className="d-flex flex-column">
          <Card.Title>{this.props.title}</Card.Title>
          <Button
            id={this.props.id}
            className="ml-auto btn-delete"
            variant="outline-danger"
            disabled={this.props.visibility < 1}
          >
            Delete
          </Button>
        </Card.Body>
        <Card.Footer className="text-right text-muted">
          {getTimeDiff(this.props.updated)}
        </Card.Footer>
      </Card>
    );
  }
}

export default NoteCard;
