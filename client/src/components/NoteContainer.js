import React, { Component } from 'react';
import { Tabs, Tab, Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import DisplayNotes from './DisplayNotes';

/*
 * This is the container for notes/templates shown
 */
class NoteContainer extends Component {
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
        <li>Note</li>
        <li>Group</li>
        <li>Folder</li>
      </ul>
    </Popover>
  );

  // Add button click is handled here
  handleAddClick = () => {
    this.refs.btnAddNote.classList.toggle('btn-add-note--opened');
  };

  // A click on popover for creation is handled here
  // When it is clicked, user is redirected to respective addition page
  handleCreateClick = e => {
    if (e.target.nodeName === 'LI') {
      this.props.history.push('/create/note');
    }
  };

  render() {
    return (
      <div className="d-flex flex-column h-100">
        {/* 3 Tabs for note/grp/folder */}
        <Tabs defaultActiveKey="notes">
          <Tab eventKey="notes" title="Notes" className="h-100">
            <DisplayNotes type="note" />
          </Tab>
          <Tab eventKey="groups" title="Groups">
            <DisplayNotes type="group" />
          </Tab>
          <Tab eventKey="folders" title="Folders">
            <DisplayNotes type="folder" />
          </Tab>
        </Tabs>

        {/* Show `+` button to add note/grp/folder */}
        <OverlayTrigger
          trigger="click"
          overlay={this.popover}
          placement="top"
          rootClose={true}
          onEnter={this.handleAddClick}
          onExit={this.handleAddClick}
        >
          <Button id="btn-add-note">
            <div ref="btnAddNote" className="btn-add-note">
              <i className="fas fa-plus" />
            </div>
          </Button>
        </OverlayTrigger>
      </div>
    );
  }
}

export default withRouter(NoteContainer);
