import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';

import CreateNote from './CreateNote';

// Generic create component.
// Handles all requests for creating note/grp/folder
class Create extends Component {
  render() {
    return <Route path="/create/note" render={() => <CreateNote />} />;
  }
}

export default withRouter(Create);
