import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Tabs, Tab, Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { MdSettings } from 'react-icons/md';

import { FaFolder } from 'react-icons/fa';
import DisplayNotes from './DisplayNotes';
import ContentSettings from './ContentSettings';

import axios from '../utils/axios';

/*
 * This component shows the notes/grp/folder owned by the user
 */
class ShowNotes extends Component {
  static propTypes = {
    history: PropTypes.instanceOf(Object).isRequired,
    match: PropTypes.instanceOf(Object).isRequired,
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
    // Meta data for the folder opened
    folderMeta: {}
  };

  // Popover to show what to create - note/grp/folder
  popover = props => (
    <Popover
      {...props}
      show={`${props.show}`}
      id="popover-add"
      onClick={this.handleCreateClick}
      onKeyPress={e => {
        if (e.key === ' ') this.handleCreateClick(...e);
      }}
      style={{ ...props.style }}
    >
      <ul>
        <li id="create$note" className="h5">
          Note
        </li>
        <li id="create$folder" className="h5">
          Folder
        </li>
      </ul>
    </Popover>
  );

  /*
   * Get the meta data of the folder
   *
   * If successful, show the folder and its content according to visibility
   * Else, deny access
   */
  getFolderMeta = () => {
    axios()
      .get(
        `/folders/meta/${this.props.match.params.id || this.props.user.root}`
      )
      .then(res => this.setState({ folderMeta: res.data }))
      .catch(() => this.setState({ folderMeta: { visibility: -1 } }));
  };

  // When component mounts, get the meta-data of the folder
  componentDidMount = () => {
    this.getFolderMeta();
  };

  // When component updates get meta-data iff folder changes
  componentDidUpdate = prevProps => {
    // If folder id changes, update the meta-data
    if (prevProps.match.params.id !== this.props.match.params.id)
      this.getFolderMeta();
  };

  // Add button click is handled here
  handleAddClick = () => {
    this.refs.btnAddNote.classList.toggle('btn-add-note--opened');
  };

  // A click on popover for creation is handled here
  // When it is clicked, user is redirected to respective addition page
  handleCreateClick = e => {
    const node = e.target;
    if (node.nodeName === 'LI') {
      const create = node.id.split('$')[1];
      this.props.history.push(`/${create}s/create`, {
        parent: this.props.match.params.id
      });
    }
  };

  render() {
    const visibility = this.state.folderMeta.visibility;
    if (typeof visibility === 'undefined') return <h1>Please wait!</h1>;
    if (visibility < 0) return <h1>Access denied</h1>;
    return (
      <div className="d-flex flex-column h-100">
        {/* Name of the note */}
        <span className="ml-3 my-2 d-flex align-items-center">
          <FaFolder />
          <span className="ml-2 font-size-2" style={{ fontSize: '1.25em' }}>
            {this.state.folderMeta.name}
          </span>
        </span>
        {/* 3 Tabs for notes,folders and settings */}
        <Tabs defaultActiveKey="notes">
          <Tab eventKey="notes" title="Notes">
            <DisplayNotes type="note" visibility={visibility} />
          </Tab>
          <Tab eventKey="folders" title="Folders">
            <DisplayNotes type="folder" visibility={visibility} />
          </Tab>
          {/* Folder settings is available only if user is the owner */}
          {this.props.user.uid === this.state.folderMeta.owner && (
            <Tab
              eventKey="settings"
              title={<MdSettings />}
              tabClassName="ml-auto"
            >
              <ContentSettings
                contentId={this.props.match.params.id || this.props.user.root}
                type="folder"
              />
            </Tab>
          )}
        </Tabs>

        {/* Show `+` button to add note/folder only if
         * user is owner or user has write access
         */}
        {(this.props.user.uid === this.state.folderMeta.owner ||
          this.state.folderMeta.visibility >= 1) && (
          <OverlayTrigger
            trigger="click"
            overlay={this.popover}
            placement="top"
            rootClose
            onEnter={this.handleAddClick}
            onExit={this.handleAddClick}
          >
            <Button id="btn-add-note">
              <div ref="btnAddNote" className="btn-add-note">
                <i className="fas fa-plus" />
              </div>
            </Button>
          </OverlayTrigger>
        )}
      </div>
    );
  }
}

// Get the required props from the state
const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default withRouter(connect(mapStateToProps)(ShowNotes));
