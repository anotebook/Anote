import React from 'react';
import { Form, InputGroup, ListGroup, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

import server from '../../utils/axios';

class XlistDisplay extends React.Component {
  isUnmount = false;

  state = {
    invalidTypeOrName: false,
    invalidCaseError: null,

    xlist: {
      name: '',
      members: [],
      owner: '',
      type: ''
    },

    editedName: '',
    nameChanged: false,
    nameUpdatedSuccess: false,

    addButtonClicked: false,
    cloneButtonClicked: false
  };

  componentDidMount() {
    const { type, name } = this.props.match.params;
    this.setState(prvState => {
      return {
        xlist: { ...prvState.xlist, type, name },
        editedName: name
      };
    });

    if (type !== 'me' && type !== 'others') {
      this.setState({ invalidTypeOrName: false });
      return;
    }

    const requestString = `/xlist/${type}/${name}`;

    server()
      .get(requestString)
      .then(response => {
        if (this.isUnmount) return;
        this.setState(prvState => ({
          xlist: { ...prvState.xlist, ...response.data }
        }));
      })
      .catch(err => {
        if (this.isUnmount) return;
        if (err.response && err.response.status === 400) {
          this.setState({
            invalidTypeOrName: true,
            invalidCaseError: err.response.data
          });
        }
        // Internal server error
        console.log('do something for the internal server error');
      });
  }

  componentWillUnmount() {
    this.isUnmount = true;
  }

  addButtonClicked = e => {
    e.preventDefault();
    this.setState({ addButtonClicked: true });
  };

  removeMember = e => {
    const email = e.target.parentElement.children[0].textContent;
    const listElement = e.target.parentElement.parentElement;

    server()
      .post(`/xlist/me/remove/${this.props.match.params.name}`, {
        email
      })
      .then(() => {
        if (this.isUnmount) return;
        this.refs.statusMessages.innerHTML = `<p style="color: green">successfully removed '${email}'!</p>`;
        setTimeout(() => {
          if (this.isUnmount) return;
          this.refs.statusMessages.innerHTML = '';
        }, 2000);
        // remove the email from the list locally also (no refresh require here)
        listElement.remove();
      })
      .catch(err => {
        if (this.isUnmount) return;
        if (err.response && err.response.status === 400) {
          // attempt to delete the user
          this.refs.statusMessages.innerHTML = `<p style="color: red">${
            err.response.data.email
          }</p>`;
          setTimeout(() => {
            if (this.isUnmount) return;
            this.refs.statusMessages.innerHTML = '';
          }, 10000);
          // other 400 responses are not for the client sending request
          // from here
        }
        if (err.response && err.response.status === 500) {
          alert('Internal server error! Please try again.');
        }
      });
  };

  addItem = () => {
    const email = this.refs.addUser.value;

    server()
      .post(`/xlist/me/${this.props.match.params.name}`, { email })
      .then(() => {
        if (this.isUnmount) return;
        /*
         * add the email to the list without refreshing the entire page again
         * Not that we cannot rely on 'this.refs.addUser.value'
         * as it is async function
         */
        this.setState(prvState => {
          prvState.xlist.members.push(email);
          return {
            addButtonClicked: false,
            xlist: { ...prvState.xlist }
          };
        });
      })
      .catch(err => {
        if (this.isUnmount) return;
        if (err.response) {
          if (err.response.status === 400) {
            if (err.response.data.email) {
              this.refs.addUserStatus.innerHTML = `${err.response.data.email}`;
              setTimeout(() => {
                if (this.isUnmount) return;
                this.refs.statusMessages.innerHTML = '';
              }, 10000);
            }
            // other errors cannot come if request send by using
            // this client interface
          } else if (err.response.status === 500) {
            this.refs.addUserStatus.innerHTML =
              'Internal Server Error! please try again.';
            setTimeout(() => {
              if (this.isUnmount) return;
              this.refs.statusMessages.innerHTML = '';
            }, 10000);
          }
        }
      });
  };

  cancelClick = () => {
    this.setState({ addButtonClicked: false });
  };

  handleNameChange = e => {
    const changedValue = e.target.value;
    this.setState({
      nameChanged: true,
      editedName: changedValue
    });
    console.log(this.state.xlist.name);
  };

  onEdit = () => {
    const name = this.state.editedName;
    server()
      .post(`/xlist/me/${this.state.xlist.name}/edit-name/${name}`)
      .then(() => {
        if (this.isUnmount) return;

        this.refs.editStatus.innerHTML =
          '<p class="text-success">Updated Successfully!</p>';

        // revert the value of 'nameChanged'
        this.setState(prvState => ({
          xlist: { ...prvState.xlist, name },
          nameChanged: false,
          nameUpdatedSuccess: true
        }));
      })
      .catch(err => {
        if (this.isUnmount) return;
        if (err.response && err.response.status === 500) {
          this.refs.editStatus.innerHTML =
            '<p class="text-danger">Internal Server Error! Please try again.</p>';
          return;
        }
        if (err.response && err.response.status === 400) {
          this.refs.editStatus.innerHTML = `<p class="text-danger">${
            err.response.data.name
          }</p>`;
        }
      });
  };

  // keep waiting for a specified time
  wait = time => {
    const start = new Date().getTime();
    let end = start;
    while (end < start + time) end = new Date().getTime();
  };

  render() {
    if (this.state.invalidTypeOrName) {
      // send the error object which can be accessed using
      // location and shall be displayed in error page
      return (
        <Redirect
          to={{
            pathname: '/error',
            state: { errorObject: this.state.invalidCaseError }
          }}
        />
      );
    }

    // if name is successfully updated then current url is invalid so refresh
    if (this.state.nameUpdatedSuccess) {
      // wait here to make the user see that the name is updated successfully!
      this.wait(2000);
      return <Redirect to="/xlist" />;
    }

    return (
      <div className="d-flex flex-column w-100 h-100">
        <div>
          <InputGroup className="mb-3">
            <Form.Control
              disabled={this.state.xlist.type === 'others'}
              onChange={this.handleNameChange}
              className="col-10"
              type="text"
              value={this.state.editedName}
              placeholder="Xlist name"
            />
            {this.props.match.params.type === 'me' && (
              <InputGroup.Append>
                <Button
                  variant="outline-primary"
                  disabled={!this.state.nameChanged}
                  onClick={this.onEdit}
                >
                  Edit
                </Button>
              </InputGroup.Append>
            )}
          </InputGroup>
          <small ref="editStatus" />
        </div>

        {this.state.xlist.type === 'others' && (
          <p className="border p-2 text-muted">
            <b>Owner: </b>
            <i>{this.state.xlist.owner}</i>
          </p>
        )}

        <ListGroup ref="listGroup">
          <ListGroup.Item variant="info">
            <b>Members</b>
          </ListGroup.Item>
          {this.state.xlist.members &&
            this.state.xlist.members.map(x => (
              <ListGroup.Item key={x} variant="light">
                <div className="d-flex flex-row">
                  <div>{x}</div>
                  {/*
                   * Delete button will show if xlist is
                   * owned by the user itself
                   * */}
                  {this.props.match.params.type === 'me' && (
                    <button
                      style={{
                        marginLeft: 'auto',
                        cursor: 'pointer',
                        border: 'none',
                        color: 'inherit',
                        background: 'none'
                      }}
                      onClick={this.removeMember}
                      type="button"
                    >
                      x
                    </button>
                  )}
                </div>
              </ListGroup.Item>
            ))}
        </ListGroup>
        <small ref="statusMessages" />

        {/* If the page type is "others" then show the clone button else 
            "show an add button and on click show the form to fill the info" */}
        <div className="d-flex flex-row" style={{ marginTop: 'auto' }}>
          {this.state.xlist.type === 'others' ? (
            this.state.cloneButtonClicked ? (
              <div className="w-100">
                <InputGroup>
                  <Form.Control
                    ref="cloneXlist"
                    placeholder="cloned xlist name"
                    aria-label="cloned xlist name"
                  />
                  <InputGroup.Append>
                    <Button onClick={this.handleClone}>Clone</Button>
                  </InputGroup.Append>
                </InputGroup>
                <small ref="cloneInfo" />
              </div>
            ) : (
              <Button
                variant="outline-dark"
                className="ml-auto mr-auto"
                onClick={this.onCloneClicked}
              >
                Clone
              </Button>
            )
          ) : this.state.addButtonClicked === false ? (
            <Button
              className="xlist-add"
              variant="primary"
              onClick={this.addButtonClicked}
            >
              <FaPlus style={{ margin: 'auto' }} />
            </Button>
          ) : (
            <div className="w-100">
              <small ref="addUserStatus" style={{ color: 'red' }} />
              <InputGroup>
                <Form.Control
                  ref="addUser"
                  placeholder="user's email"
                  aria-label="user's email"
                />
                <InputGroup.Append>
                  <Button variant="outline-success" onClick={this.addItem}>
                    Add
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={this.cancelClick}
                  >
                    Cancel
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default XlistDisplay;
