import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import toggleMenu from '../actions/toggleMenu';
import { hamburger } from '../images/hamburger.png';

class Scrollspy extends React.Component {
  static propTypes = {
    menuDisp: PropTypes.func.isRequired,
    toggleMenu: PropTypes.func.isRequired
  };

  menuToggle = () => {
    console.log(`${this.props.toggleMenu} : inside the scrollspy`);
    this.props.toggleMenu();
  };

  render() {
    return (
      <div>
        <button type="button" onClick={this.menuToggle}>
          <img
            src={hamburger}
            alt="hamburger-menu"
            width="40px"
            height="40px"
            className="img-hamburger"
            style={{ position: 'fixed', top: 10, left: 15, zIndex: 10000 }}
            ref="hamburger_menu"
          />
        </button>
        <div
          className={`sideNav bg-light ${
            this.props.menuDisp === true ? 'sideNav--show' : 'sideNav--hide'
          }`}
          ref="sideNav"
        >
          <ul className="menu">
            <li className="menu-item">Room</li>
            <li className="menu-item">X-List</li>
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    menuDisp: state.toggleMenu
  };
};

export default connect(
  mapStateToProps,
  { toggleMenu }
)(Scrollspy);
