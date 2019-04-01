import React, { Component } from 'react';
import { Route, withRouter, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';

import ShowNotes from './ShowNotes';
import CreateNote from './CreateNote';
import ViewNote from './ViewNote';

/*
 * This is the container for notes/templates shown
 */
class NoteContainer extends Component {
  static propTypes = {
    create: PropTypes.string.isRequired
  };

  render() {
    return (
      <Switch>
        <Route exact path="/notes/show" component={ShowNotes} />
        <Route exact path="/notes/open/:id" component={ViewNote} />
        <Route
          exact
          path={`/${this.props.create}s/create`}
          render={() => <CreateNote create={this.props.create} />}
        />
        <Route
          exact
          path="/folders/open/:id([\d|a-f]{40})"
          sensitive
          component={ShowNotes}
        />
        <Route path="/" render={() => <h1>Not found!</h1>} />
      </Switch>
    );
  }
}

export default withRouter(NoteContainer);
