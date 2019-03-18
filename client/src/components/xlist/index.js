import React from 'react';
import { Route } from 'react-router-dom';

import CardContainer from './CardContainer';
import Display from './Display';

class XList extends React.Component {
  render() {
    return (
      <div className="w-100 h-100 p-3">
        <Route exact path="/xlist" component={CardContainer} />
        <Route exact path="/xlist/:type/:name" component={Display} />
      </div>
    );
  }
}

export default XList;
