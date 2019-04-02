import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { convertToRaw, KeyBindingUtil } from 'draft-js';
import { Editor, createEditorState, keyBindingFn } from 'medium-draft';
import mediumDraftImporter from 'medium-draft/lib/importer';
import mediumDraftExporter from 'medium-draft/lib/exporter';
import { Button, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaRegSave, FaStickyNote } from 'react-icons/fa';
import { MdSettings } from 'react-icons/md';

import ContentSettings from './ContentSettings';

import axios from '../utils/axios';

import 'medium-draft/lib/index.css';

const { hasCommandModifier } = KeyBindingUtil;

class ViewNote extends Component {
  static propTypes = {
    isMenuDisp: PropTypes.bool.isRequired,
    location: PropTypes.instanceOf(Object).isRequired,
    user: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      about: PropTypes.string,
      email: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      picture: PropTypes.string.isRequired,
      root: PropTypes.string.isRequired,
      uid: PropTypes.string.isRequired,
      userHandle: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired
    }).isRequired
  };

  state = {
    editorState: createEditorState(),
    title: '',
    note: {},
    visibility: undefined,
    isSettingsOpen: false,
    isSuccessAlertOpen: false
  };

  alertTimeout = null;

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
      ),
      // If user is owner, visibility is 2 else get visibility from access list
      visibility:
        this.props.user.uid === note.owner ? 2 : note.xlist[0].visibility
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
        this.setState({ isSuccessAlertOpen: true });
        this.alertTimeout = setTimeout(this.closeNoteSavedAlert, 2500);
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
    // Get the note id
    let path = this.props.location.pathname;
    path = path.substr(path.lastIndexOf('/') + 1);
    // Get the note
    axios()
      .get(`/notes/view/${path}`)
      .then(res => {
        this.setInitialState(res.data);
      })
      .catch(err => {
        if (err.response.status === 404) this.setState({ visibility: -1 });
      });

    // TODO: Save the note to the database every minute automatically
  };

  // Updates note settings to be opened or closed
  openNoteSettings = () => {
    this.setState(prevState => {
      return { isSettingsOpen: !prevState.isSettingsOpen };
    });
  };

  // Close the note saved alert notification
  closeNoteSavedAlert = () => {
    this.setState({ isSuccessAlertOpen: false });
  };

  // When component is about to un-mount, close the success alert
  componentWillUnmount = () => {
    clearTimeout(this.alertTimeout);
    this.closeNoteSavedAlert();
  };

  render() {
    const width = window.innerWidth - (this.props.isMenuDisp ? 250 : 70);

    const visibility = this.state.visibility;
    if (typeof visibility === 'undefined') return <h1>Please wait!</h1>;
    if (visibility < 0) return <h1>Access denied</h1>;
    return (
      <>
        <div className="d-flex">
          <div className="flex-grow-1">
            {this.state.isSettingsOpen && (
              <div className="m-3">
                <ContentSettings contentId={this.state.note.id} type="note" />
              </div>
            )}
            {!this.state.isSettingsOpen && (
              <>
                {/* Note title */}
                <div className="d-flex align-items-center">
                  <FaStickyNote
                    className="m-2"
                    style={{ fontSize: '1.25em' }}
                  />
                  <input
                    value={this.state.title}
                    placeholder="Untitled"
                    onChange={e => this.handleTitleChange(e.target.value)}
                    style={{
                      outline: 'none',
                      border: 'none',
                      padding: '8px',
                      fontSize: '1.75em',
                      width: '100%'
                    }}
                    disabled={
                      typeof this.state.visibility === 'undefined' ||
                      this.state.visibility < 1
                    }
                  />
                </div>
                {/* Note editor */}
                <div style={{ width: `${width}px` }}>
                  <Editor
                    ref={this.refsEditor}
                    editorState={this.state.editorState}
                    onChange={this.onEditorStateChange}
                    placeholder="Make note of..."
                    keyBindingFn={this.keyBinding}
                    handleKeyCommand={this.handleKeyCommand}
                    sideButtons={[]}
                    readOnly={
                      typeof this.state.visibility === 'undefined' ||
                      this.state.visibility < 1
                    }
                    editorEnabled={
                      !(
                        typeof this.state.visibility === 'undefined' ||
                        this.state.visibility < 1
                      )
                    }
                  />
                </div>
              </>
            )}
          </div>
          {/* Save option should be available iff user has edit access */}
          {!(
            typeof this.state.visibility === 'undefined' ||
            this.state.visibility < 1
          ) && (
            <div
              className="d-flex flex-column"
              style={{ position: 'fixed', right: '0', zIndex: '1000' }}
            >
              <OverlayTrigger
                delay={{ show: 250, hide: 200 }}
                overlay={<Tooltip>Save</Tooltip>}
                placement="auto"
              >
                <Button
                  onClick={this.saveNote}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '20px',
                    margin: '8px'
                  }}
                >
                  <FaRegSave />
                </Button>
              </OverlayTrigger>
              {/* Settings should be accessible only is user is the owner */}
              {this.props.user.uid === this.state.note.owner && (
                <OverlayTrigger
                  delay={{ show: 250, hide: 200 }}
                  overlay={<Tooltip>Settings</Tooltip>}
                  placement="auto"
                >
                  <Button
                    className="btn-content-settings"
                    onClick={this.openNoteSettings}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '20px',
                      margin: '8px',
                      padding: '8px',
                      lineHeight: '12px',
                      verticalAlign: 'middle'
                    }}
                  >
                    <MdSettings className="m-auto" />
                  </Button>
                </OverlayTrigger>
              )}
            </div>
          )}
        </div>
        <Alert
          ref="noteSavedAlert"
          show={this.state.isSuccessAlertOpen}
          dismissible
          variant="success"
          className="fixed-bottom mx-auto my-5 w-75 w-sm-50 w-md-30"
          style={{ maxWidth: '300px' }}
          onClose={this.closeNoteSavedAlert}
        >
          Note saved
        </Alert>
      </>
    );
  }
}

// Get the required props from the state
const mapStateToProps = state => {
  return {
    user: state.user,
    isMenuDisp: state.toggleMenu,
    widthChanged: state.widthChanged
  };
};

export default withRouter(connect(mapStateToProps)(ViewNote));
