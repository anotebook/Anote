import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';

import ShowNotes from './ShowNotes';
import CreateNote from './CreateNote';

/*
 * This is the container for notes/templates shown
 */
class NoteContainer extends Component {
  render() {
    return (
      <>
        <Route exact path="/notes/show" component={ShowNotes} />
        <Route exact path="/notes/create" component={CreateNote} />
      </>
    );
  }
}

export default withRouter(NoteContainer);
