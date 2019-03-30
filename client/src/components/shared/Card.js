import React from 'react';
import { Card } from 'react-bootstrap';
import { FaFolder, FaStickyNote } from 'react-icons/fa';
import PropTypes from 'prop-types';

import './index.css';

class SharedCard extends React.Component {
  static defaultProps = {
    className: ''
  };

  static propTypes = {
    arr: PropTypes.instanceOf(Array).isRequired,
    className: PropTypes.string,
    type: PropTypes.oneOf(['note', 'folder']).isRequired
  };

  render() {
    return (
      <div className={`d-flex flex-row flex-wrap ${this.props.className}`}>
        {this.props.arr.map(x => (
          <div
            key={x.id}
            id={`${this.props.type}$$JAADU$$${x.id}`}
            className="m-2 p-1 rounded border border-secondary d-flex flex-row shared-card"
            style={{
              width: '200px',
              height: '50px',
              cursor: 'pointer'
            }}
          >
            <div className="p-2">
              {this.props.type === 'folder' ? <FaFolder /> : <FaStickyNote />}
            </div>
            <b className="p-2 text-overflow-control">{x.name}</b>
          </div>
        ))}
      </div>
    );
  }
}

export default SharedCard;
