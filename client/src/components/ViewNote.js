import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { convertToRaw, KeyBindingUtil } from 'draft-js';
import { Editor, createEditorState, keyBindingFn } from 'medium-draft';
import mediumDraftImporter from 'medium-draft/lib/importer';
import mediumDraftExporter from 'medium-draft/lib/exporter';
import { Button } from 'react-bootstrap';
import { FaRegSave } from 'react-icons/fa';

import axios from '../utils/axios';

import 'medium-draft/lib/index.css';

const { hasCommandModifier } = KeyBindingUtil;

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

  // Called when note's title changes to update the title's state
  handleTitleChange = title => {
    this.setState({ title });
  };

  /*
   * Called when key is pressed
   *
   * If special handling is required, it should be handled here
   * Currently handled bindings-
   * 1. ctrl+s => save
   */
  keyBinding = e => {
    // If `ctrl` was used
    if (hasCommandModifier(e)) {
      // `s` button
      if (e.which === 83) {
        // `ctrl` + `s`
        return 'save-note';
      }
    }
    return keyBindingFn(e);
  };

  /*
   * Should be called when a key command needs to be handled
   *
   * Not working as expected.
   * It is not being called to handle the command
   *
   * TODO: Fix this to make key bindings work properly
   * FIXME: This needs to be called
   */
  handleKeyCommand = command => {
    if (command === 'save-note') {
      return true;
    }
    return false;
  };

  // This function is called to set the initial state of our note editor
  setInitialState = note => {
    this.setState({
      title: note.title,
      note,
      editorState: createEditorState(
        convertToRaw(mediumDraftImporter(note.content || ''))
      )
    });
    // Set the focus
    this.refsEditor.current.focus();
  };

  /*
   * When user wants to save the note, this function is called
   */
  saveNote = () => {
    // TODO: Save the note only if contents change

    // Get the note content in HTML format
    const content = mediumDraftExporter(
      this.state.editorState.getCurrentContent()
    );
    // Get the id and title of the note
    const { id } = this.state.note;
    const title = this.state.title;
    // Send the update request
    axios()
      .put('/notes/update', {
        id,
        title,
        content
      })
      .then((/* oldNote */) => {
        // TODO: Inform user about successful update
      })
      .catch((/* err */) => {
        // TODO: Inform user about the error
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
    /* // If availble, set the editor state and return
    if (note) {
      this.setInitialState(note);
      return;
    } */
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

    // TODO: Save the note to the database every minute automatically
  };

  render() {
    return (
      <div style={{ position: 'relative' }}>
        {/* Note title */}
        <input
          value={this.state.title}
          onChange={e => this.handleTitleChange(e.target.value)}
          style={{
            outline: 'none',
            border: 'none',
            padding: '8px',
            fontSize: '1.75em'
          }}
        />
        {/* Note editor */}
        <Editor
          ref={this.refsEditor}
          editorState={this.state.editorState}
          onChange={this.onEditorStateChange}
          placeholder="Make note of..."
          keyBindingFn={this.keyBinding}
          handleKeyCommand={this.handleKeyCommand}
        />
        <Button
          onClick={this.saveNote}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '20px',
            position: 'absolute',
            top: '8px',
            right: '8px'
          }}
        >
          <FaRegSave />
        </Button>
      </div>
    );
  }
}

export default withRouter(ViewNote);
