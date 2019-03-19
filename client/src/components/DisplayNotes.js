import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { CardColumns } from 'react-bootstrap';

import NoteCard from './NoteCard';

import axios from '../utils/axios';

// This component displays the notes inside the notes container
class DisplayNotes extends Component {
  static propTypes = {
    // Type [note/grp/folder]
    type: PropTypes.string.isRequired
  };

  state = {
    // Store the notes
    contentArray: []
  };

  // As the component mounts, fetch all the notes/grp/folder
  componentDidMount = () => {
    const path = this.props.history.location.pathname;
    let folder = 'root';
    if (path.startsWith('/folders/show/'))
      folder = path.substr(path.lastIndexOf('/') + 1);
    axios()
      .get(`/${this.props.type}s/get/${folder}`)
      // Update the state to show the fetched data
      .then(res => this.setState({ contentArray: res.data }));
  };

  getCardIfClicked = node => {
    while (node) {
      if (node.classList.contains('card')) return node;
      node = node.parentElement;
    }
    return null;
  };

  handleCardColumnClick = node => {
    const card = this.getCardIfClicked(node);
    if (card) {
      const note = this.state.contentArray[parseInt(card.id, 10)];
      this.props.history.push(`/notes/open/${note.id}`, { note });
    }
  };

  render() {
    return (
      <CardColumns
        className="h-100"
        onClick={e => this.handleCardColumnClick(e.target)}
      >
        {/*
         * Show the fetched notes
         */}
        {this.state.contentArray.map((item, index) => (
          <NoteCard
            key={item.id}
            id={index.toString()}
            type={this.props.type}
            title={item.title}
            text={item.content}
            updated={item.timestamp}
          />
        ))}
      </CardColumns>
    );
  }
}

export default withRouter(DisplayNotes);
