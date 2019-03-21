import React, { Component } from 'react';
import { Card, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

// Custom card to display a note/template
class NoteCard extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    type: PropTypes.string.isRequired,
    updated: PropTypes.number
  };

  static defaultProps = {
    title: ''
  };

  static defaultProps = {
    updated: 'Just now'
  };

  render() {
    // TODO: Update card design acc to the type(note/grp/folder)
    return (
      <Card id={this.props.id} style={{ cursor: 'pointer' }}>
        <Card.Body className="d-flex flex-column">
          <Card.Title>{this.props.title}</Card.Title>
          <Button
            id={this.props.id}
            className="ml-auto btn-delete"
            variant="outline-danger"
          >
            Delete
          </Button>
        </Card.Body>
        <Card.Footer className="text-right text-muted">
          {this.props.updated}
        </Card.Footer>
      </Card>
    );
  }
}

export default NoteCard;
