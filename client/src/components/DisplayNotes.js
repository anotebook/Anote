import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    axios()
      .get(`/${this.props.type}s`)
      // Update the state to show the fetched data
      .then(res => this.setState({ contentArray: res.data }));
  };

  render() {
    return (
      <CardColumns className="h-100">
        {/*
         * Show the fetched notes
         */}
        {this.state.contentArray.map(item => (
          <NoteCard
            key={item.id}
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

export default DisplayNotes;
