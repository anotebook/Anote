import React, { Component } from 'react';
import { Card, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FaFolder, FaStickyNote } from 'react-icons/fa';

import getTimeDiff from '../utils/getTimeDifference';

// Custom card to display a note/template
class NoteCard extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    type: PropTypes.oneOf(['note', 'folder']).isRequired,
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
    return (
      <Card id={this.props.id} style={{ cursor: 'pointer' }}>
        <Card.Body className="d-flex flex-column">
          <Card.Title className="d-flex align-items-center">
            <h5 className="text-overflow-control">
              {this.props.type === 'note' ? <FaStickyNote /> : <FaFolder />}
              <span className="ml-2">
                {this.props.title || (
                  <span className="text-muted font-italic pr-1">Untitled</span>
                )}
              </span>
            </h5>
          </Card.Title>
          {/* TODO: In case of note, how card summary */}
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
