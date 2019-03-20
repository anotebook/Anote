import React from 'react';
import { CardColumns, Button, Form } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { FaPlus } from 'react-icons/fa';

import './index.css';
import server from '../../utils/axios';
import XlistCard from './Card';
import VerticallyCenteredModal from './VerticallyCenteredModal';

class XlistCardContainer extends React.Component {
  isUnmount = false;

  state = {
    myXlists: [],

    clickedCardName: null,
    clickedCardType: null,

    addXlistClicked: false,
    addXlistError: null
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

  deleteId = element => {
    const name = element.id.split('$$')[1];
    server()
      .delete(`/xlist/me/${name}`)
      .then(() => {
        if (this.isUnmount) return;

        // update the myXlist state
        this.setState(prvState => {
          prvState.myXlists.filter(x => x.name !== name);
          return {
            myXlist: { ...prvState.myXlist }
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

  onClick = e => {
    e.preventDefault();

    // clicked the delete button
    if (e.target.id.includes('delete$$')) {
      this.deleteId(e.target);
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
          push={true}
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
