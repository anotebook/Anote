import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';

// Custom card to display a note/template
class NoteCard extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    text: PropTypes.string,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    updated: PropTypes.number
  };

  static defaultProps = {
    text: '',
    updated: 'Just now'
  };

  render() {
    return (
      <Card id={this.props.id} style={{ cursor: 'pointer' }}>
        <Card.Body>
          <Card.Title>{this.props.title}</Card.Title>
          <Card.Text>{this.props.text}</Card.Text>
        </Card.Body>
        <Card.Footer className="text-right text-muted">
          {this.props.updated}
        </Card.Footer>
      </Card>
    );
  }
}

export default NoteCard;
