import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { convertToRaw } from 'draft-js';
import { Editor, createEditorState } from 'medium-draft';
import mediumDraftImporter from 'medium-draft/lib/importer';

import axios from '../utils/axios';

import 'medium-draft/lib/index.css';

class ViewNote extends Component {
  state = {
    editorState: createEditorState(),
    title: ''
  };

  refsEditor = React.createRef();

  // Called when editor's content changes to update the editor's state
  onEditorStateChange = editorState => {
    this.setState({ editorState });
  };

  // This function is called to set the initial state of our note editor
  setInitialState = note => {
    this.setState({
      title: note.title,
      editorState: createEditorState(
        convertToRaw(mediumDraftImporter(note.content || ''))
      )
    });
  };

  /*
   * When component mounts,
   * 1. Bring the focus to the editor
   * 2. Load the note if available from route state
   *    i.e., If opened on click from a card or after creation
   * 3. If state not available (opened directly?), load from server
   * 4. Update the editor state after load
   */
  componentDidMount = () => {
    // Set the focus
    this.refsEditor.current.focus();

    // Try to get the note from route state
    let note = this.props.location.state
      ? this.props.location.state.note
      : null;
    // If availble, set the editor state and return
    if (note) {
      this.setInitialState(note);
      return;
    }
    /* If not, request the server */
    // Get the note id
    let path = this.props.location.pathname;
    path = path.substr(path.lastIndexOf('/') + 1);
    // Get the note
    axios()
      .get(`/notes/view/${path}`)
      .then(res => {
        note = res.data;
        this.setInitialState(note);
      });
  };

  render() {
    return (
      <>
        {/* Note title */}
        <h2>{this.state.title}</h2>
        {/* Note editor */}
        <Editor
          ref={this.refsEditor}
          editorState={this.state.editorState}
          onChange={this.onEditorStateChange}
        />
      </>
    );
  }
}

export default withRouter(ViewNote);
