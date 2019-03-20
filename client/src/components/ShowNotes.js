import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Tabs, Tab, Button, OverlayTrigger, Popover } from 'react-bootstrap';

import DisplayNotes from './DisplayNotes';

/*
 * This component shows the notes/grp/folder owned by the user
 */
class ShowNotes extends Component {
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
        <li id="create$note">Note</li>
        <li id="create$group">Group</li>
        <li id="create$folder">Folder</li>
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
    const node = e.target;
    if (node.nodeName === 'LI') {
      const create = node.id.split('$')[1];
      this.props.history.push(`/${create}s/create`, {
        from: this.props.history.location.pathname
      });
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

export default withRouter(ShowNotes);
