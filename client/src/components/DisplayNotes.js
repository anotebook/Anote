import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CardColumns } from 'react-bootstrap';

import NoteCard from './NoteCard';

// This component displays the notes inside the notes container
class DisplayNotes extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired
  };

  render() {
    return (
      <CardColumns className="h-100">
        {/* Notes are currently hard-coded
            TODO: Fetch the user's notes from DB
         */}
        <NoteCard
          type={this.props.type}
          title="Welcome!"
          text="Welcome to PRS notes!
            We hope youe like this innovative notes dgsfgs fhghg dgrtestfdgrvt tty  app!"
          updated="01-01-2019"
        />
        <NoteCard
          type={this.props.type}
          title="Welcome!"
          text="Welcome to PRS notes!
              We hope youe like sad asr s gstrrs e tst s dfd df s er srerrt yre tstttgst sd srtr this innovative notes app!"
          updated="02-01-2019"
        />
        <NoteCard
          type={this.props.type}
          title="Welcome!"
          text="Welcome to PRS notes!
              We hope youe like this innovative fdddgfd  gd fdy notes app!"
          updated="03-01-2019"
        />
        <NoteCard
          type={this.props.type}
          title="Welcome!"
          text="Welcome to PRS notes!
              We hope youe like this innovative fdsdtfhtg std  ddzs sdg dg notes app!"
          updated="04-01-2019"
        />
        <NoteCard
          type={this.props.type}
          title="Welcome!"
          text="Welcome to PRS notes!
              We hope youe like this innovative notes app!"
          updated="05-01-2019"
        />
      </CardColumns>
    );
  }
}

export default DisplayNotes;
