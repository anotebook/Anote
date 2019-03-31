import React from 'react';
import { CardColumns, Button, Form, Modal } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { FaPlus } from 'react-icons/fa';
import PropTypes from 'prop-types';

import './index.css';
import server from '../../utils/axios';
import XlistCard from './Card';
import VerticallyCenteredModal from './VerticallyCenteredModal';

class XlistCardContainer extends React.Component {
  static propTypes = {
    auth: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      about: PropTypes.string,
      email: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      picture: PropTypes.string.isRequired,
      uid: PropTypes.string.isRequired,
      userHandle: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired
    }).isRequired
  };

  isUnmount = false;

  state = {
    myXlists: [],

    clickedCardName: null,
    clickedCardType: null,

    addXlistClicked: false,
    addXlistError: null,

    // State if confirmation modal should be opened or closed
    isConfirmDeleteOpen: false,
    // Stores the id of the note/folder to be deleted
    toBeDeleted: null
  };

  componentDidMount() {
    server()
      .get('/xlist/me')
      .then(response => {
        if (this.isUnmount) return;
        this.setState({
          myXlists: response.data,
          clickedCardType: 'me'
        });
      })
      .catch(err => {
        if (this.isUnmount) return;
        if (err.response) {
          const res = err.response;
          if (res.status === 400) {
            /*
             * token is incorrect or not sent!
             * so logout the user and the privateRoute will take care of the
             * fact that after login user lands here directly!
             */
            // this.props.logout();
          }
        }
      });
  }

  componentWillUnmount() {
    this.isUnmount = true;
  }

  clickedInsideCard = node => {
    while (node) {
      if (node.classList.contains('card')) return node;
      node = node.parentElement;
    }
    return null;
  };

  deleteId = _id => {
    const name = _id.split('$$')[1];

    server()
      .delete(`/xlist/me/${name}`)
      .then(() => {
        if (this.isUnmount) return;

        // update the myXlist state
        this.setState(prvState => {
          prvState.myXlists = prvState.myXlists.filter(x => x.name !== name);
          return {
            myXlists: prvState.myXlists,
            toBeDeleted: null,
            isConfirmDeleteOpen: false
          };
        });
      })
      .catch(err => {
        if (this.isUnmount) return;
        if (err.response) {
          // TODO: Show error message
        }
      });
  };

  // Show delete confirmation modal
  confirmAndDelete = _id => {
    this.setState({ toBeDeleted: _id, isConfirmDeleteOpen: true });
  };

  onClick = e => {
    e.preventDefault();

    // clicked the delete button
    if (e.target.id.includes('delete$$')) {
      this.confirmAndDelete(e.target.id);
      return;
    }

    const card = this.clickedInsideCard(e.target);
    if (card) {
      const cardNameAndEmail = card.id.split('$$');
      this.setState({
        clickedCardName: cardNameAndEmail[0]
      });
    }
  };

  // Close delete confirmation modal
  closeDeleteConfirmation = () => {
    this.setState({ toBeDeleted: null, isConfirmDeleteOpen: false });
  };

  convertArrayToString = arr => {
    let str = '';
    for (let j = 0; j < arr.length; j += 1) {
      const i = arr[j];
      str += `${i}\n`;
    }
    return str;
  };

  onXlistAdd = () => {
    const name = this.refs.xlistName.value;
    server()
      .post('/xlist/create', { members: [], name })
      .then(() => {
        if (this.isUnmount) return;
        this.setState({ clickedCardName: name });
      })
      .catch(err => {
        if (this.isUnmount) return;
        if (err.response) {
          const res = err.response;
          if (res.status === 400 && res.data.name) {
            this.setState({ addXlistError: res.data.name });
            return;
          }
          if (res.status === 500) this.setState({ addXlistError: res.data });
        }
      });
  };

  render() {
    if (this.state.clickedCardName) {
      return (
        <Redirect
          to={{
            pathname: `/xlist/${this.state.clickedCardType}/${
              this.state.clickedCardName
            }`
          }}
          push
        />
      );
    }
    return (
      <div className="d-flex flex-column h-100">
        <CardColumns style={{ marginTop: '20px' }} onClick={this.onClick}>
          {this.state.myXlists.map(x => (
            <XlistCard
              key={x.name}
              title={x.name}
              type="me"
              owner={this.props.auth.email}
              lastUpdated={new Date(x.lastUpdated)}
              members={x.members}
            />
          ))}
        </CardColumns>
        <Button
          className="xlist-add"
          variant="primary"
          onClick={() => this.setState({ addXlistClicked: true })}
        >
          <FaPlus style={{ margin: 'auto' }} />
        </Button>

        <VerticallyCenteredModal
          heading="Add a new X-List"
          show={this.state.addXlistClicked}
          onHide={() => this.setState({ addXlistClicked: false })}
        >
          <div className="d-flex flex-column bg-light">
            <Form.Control
              type="text"
              placeholder="X-List name"
              isInvalid={this.state.addXlistError !== null}
              ref="xlistName"
            />
            <Form.Control.Feedback type="invalid">
              {this.state.addXlistError}
            </Form.Control.Feedback>

            <Button
              variant="outline-success"
              className="mt-2 ml-auto"
              onClick={this.onXlistAdd}
            >
              Create
            </Button>
          </div>
        </VerticallyCenteredModal>

        {/* Modal for delete confirmation */}
        <Modal
          show={this.state.isConfirmDeleteOpen}
          onHide={this.closeDeleteConfirmation}
        >
          <Modal.Header>
            <Modal.Title>Confirm delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete?</Modal.Body>
          <Modal.Footer>
            {/* Cancel deletion */}
            <Button
              variant="outline-secondary"
              onClick={this.closeDeleteConfirmation}
            >
              Oops! Go back
            </Button>
            {/* Confirmation deletion */}
            <Button
              variant="danger"
              onClick={() => this.deleteId(this.state.toBeDeleted)}
            >
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.user
  };
};

export default connect(mapStateToProps)(XlistCardContainer);
