import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import server from '../../utils/axios';
import Card from './Card';

class Shared extends React.Component {
  isUnmount = false;

  state = {
    key: 'read',
    notes: [],
    folders: [],

    // for redirecting to appropraite page
    cardClicked: false,
    clickedCardType: '',
    clickedCardId: ''
  };

  componentDidMount() {
    this.refresh('read');
    /* this.setState({
      notes: [
        { name: 'abcdedfdfsfss' },
        { name: 'abcdedfdfsfss' },
        { name: 'abcdedfdfsfss' },
        { name: 'abcdedfdfsfss' },
        { name: 'abcdedfdfsfss' },
        { name: 'abcdedfdfsfss' }
      ]
    });
    */
  }

  componentWillUnmount() {
    this.isUnmount = true;
  }

  refresh = type => {
    server()
      .get(`/access/shared/with-me/${type}`)
      .then(res => {
        if (this.isUnmount) return;
        this.setState({ notes: res.data.notes, folders: res.data.result });
      })
      .catch(err => {});
  };

  onTabSelect = activeKey => {
    this.setState({
      key: activeKey,
      notes: [],
      folders: []
    });
    this.refresh(activeKey);
  };

  checkClickedInsideCard = e => {
    while (e) {
      if (e.id && e.id.includes('$$JAADU$$')) return e;
      e = e.parentElement;
    }
    return null;
  };

  handleClick = e => {
    const target = this.checkClickedInsideCard(e.target);
    if (target) {
      // A valid card element clicked
      const data = target.id.split('$$');
      const id = data[2];
      const type = data[0];

      this.setState({
        cardClicked: true,
        clickedCardId: id,
        clickedCardType: type
      });
    }
  };

  render() {
    if (this.state.cardClicked) {
      return (
        <Redirect
          to={`/${this.state.clickedCardType}s/open/${
            this.state.clickedCardId
          }`}
          push
        />
      );
    }

    return (
      <Tabs activeKey={this.state.key} onSelect={this.onTabSelect}>
        <Tab eventKey="read" title="Read-Only">
          <div
            onClick={this.handleClick}
            role="main"
            onKeyPress={this.handleClick}
          >
            <Card type="folder" arr={this.state.folders} />
            <Card type="note" arr={this.state.notes} className="mt-4 pt-3" />
          </div>
        </Tab>
        <Tab eventKey="write" title="Read-Write">
          <div
            onClick={this.handleClick}
            role="main"
            onKeyPress={this.handleClick}
          >
            <Card type="folder" arr={this.state.folders} />
            <Card type="note" arr={this.state.notes} className="mt-4 pt-3" />
          </div>
        </Tab>
      </Tabs>
    );
  }
}

export default Shared;
