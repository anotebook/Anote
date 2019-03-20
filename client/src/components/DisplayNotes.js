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

  // It returns the clicked node if it's either note card/note delete button
  getCardIfClicked = node => {
    while (node) {
      if (
        node.classList.contains('card') ||
        node.classList.contains('btn-delete')
      )
        return node;
      node = node.parentElement;
    }
    return null;
  };

  /*
   * When the card column is clicked, this is called
   *
   * It recieves the node if it is the note card or it's delete button.
   * Then according to the node-
   * 1. If card clicked, open the note to view/edit
   * 2. If delete button clicked, delete the note
   */
  handleCardColumnClick = node => {
    // Get the node, if either of them clicked
    const clicked = this.getCardIfClicked(node);
    // If either of them is clicked, go ahead
    if (clicked) {
      switch (clicked.nodeName) {
        // If the card is clicked, open the card
        case 'DIV': {
          const note = this.state.contentArray[parseInt(clicked.id, 10)];
          // Route to opening the note
          this.props.history.push(`/notes/open/${note.id}`, { note });
          break;
        }
        // If the button is clicked, delete the button
        case 'BUTTON': {
          const index = parseInt(clicked.id, 10);
          const noteId = this.state.contentArray[index].id;
          // Send the delete request
          axios()
            .delete(`/notes/delete/${noteId}`)
            .then((/* res */) => {
              this.setState(prevState => {
                prevState.contentArray.splice(index, 1);
                return { contentArray: prevState.contentArray };
              });
            })
            .catch((/* err */) => {
              // TODO: Notify user of the error
            });
          break;
        }
        default:
          break;
      }
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
