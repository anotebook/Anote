import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import {
  Tabs,
  Tab,
  Button,
  OverlayTrigger,
  Popover,
  Breadcrumb
} from 'react-bootstrap';
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
    folderMeta: { path: [] }
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
    const folderId = this.props.match.params.id || this.props.user.root;
    axios()
      // Get meta data about the folder
      .get(`/folders/meta/${folderId}`)
      .then(res => {
        // If fetched successfully, update the state
        this.setState({ folderMeta: res.data });
        // After successful meta-data fetch,
        // get the path from the root folder to this folder (for breadcrumb)
        axios()
          .get(`/folders/meta/path/${folderId}`)
          .then(pathRes => {
            // Update the path data
            this.setState(prevState => {
              return {
                folderMeta: { ...prevState.folderMeta, path: pathRes.data }
              };
            });
          });
      })
      // If error occurs, deny access
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
    // If visibility is not defined => loading the data
    if (typeof visibility === 'undefined') return <h1>Please wait!</h1>;
    // If visibility < 0, user doesn't have access
    if (visibility < 0) return <h1>Access denied</h1>;

    // Get the path of the current folder
    let path = this.state.folderMeta.path;
    if (!path || !(path instanceof Array) || path.length === 0) path = null;

    return (
      <div className="d-flex flex-column h-100">
        {/* Path of the note */}
        <Breadcrumb
          listProps={{
            className: 'd-flex align-items-center p-2 m-0'
          }}
        >
          {/* Folder icon */}
          <FaFolder />
          {/* If path is available, show the path.
              Otherwise show the folder name */}
          {path ? (
            // Path name is available, show the path
            <>
              {/* Show path for small+ devices,
                  but only name for extra small devices */}
              <div className="d-none d-sm-block">
                {/*
                 * We will show path for only upto 3 folders.
                 *
                 * For more nested folders, we show `...`
                 * to  indicate more folders in between.
                 * Atleast 1 item is shown as item is guaranteed to present.
                 * Others depend on the depth of folder
                 */}

                {/* The origin for the folder
                 * (root for owner/shared folder for receipants)
                 */}
                <Link
                  to={`/folders/open/${path[0].id}`}
                  className="p-1"
                  key={path[0].id}
                  style={
                    path.length === 1 ? { color: '#666' } : { color: 'blue' }
                  }
                >
                  / {path[0].name}
                </Link>

                {/* If path is nested more than 3 levels, we show 3 dots */}
                <span>{path.length > 3 ? '/ ... ' : ''}</span>

                {/* Show parent of the current folder, if not already shown */}
                {path.length - 2 > 0 && (
                  <Link
                    to={`/folders/open/${path[path.length - 2].id}`}
                    className="p-1"
                    key={path[path.length - 2].id}
                    style={{ color: 'blue' }}
                  >
                    / {path[path.length - 2].name}
                  </Link>
                )}

                {/* Show current folder, if not already shown */}
                {path.length - 1 > 0 && (
                  <Link
                    to={`/folders/open/${path[path.length - 1].id}`}
                    className="p-1"
                    key={path[path.length - 1].id}
                    style={{ color: '#666' }}
                  >
                    / {path[path.length - 1].name}
                  </Link>
                )}
              </div>

              {/* Show name of the folder for extra small devices */}
              <span className="d-block d-sm-none p-1" style={{ color: '#666' }}>
                {this.state.folderMeta.name}
              </span>
            </>
          ) : (
            // Show only folder name if path is not available
            <span className="p-1" style={{ color: '#666' }}>
              {this.state.folderMeta.name}
            </span>
          )}
        </Breadcrumb>

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
