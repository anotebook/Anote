import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FaRegStickyNote, FaRegListAlt } from 'react-icons/fa';
import { MdPeopleOutline, MdHelpOutline, MdMenu } from 'react-icons/md';

import toggleMenu from '../actions/toggleMenu';

class Scrollspy extends React.Component {
  static propTypes = {
    menuDisp: PropTypes.bool.isRequired,
    toggleMenu: PropTypes.func
  };

  static defaultProps = {
    toggleMenu: null
  };

  /*
    Dispatches the action to toggle the menu state
  */
  menuToggle = () => {
    if (this.props.toggleMenu) this.props.toggleMenu();
  };

  render() {
    const open = this.props.menuDisp;

    return (
      <div>
        <button
          type="button"
          ref="hamburger_menu"
          className="img-hamburger"
          style={{
            position: 'fixed',
            width: '40px',
            height: '40px',
            padding: '0',
            top: 10,
            left: 15,
            zIndex: 1040,
            border: 'none',
            outline: 'none',
            background: 'none'
          }}
          onClick={this.menuToggle}
        >
          <MdMenu
            style={{
              width: '28px',
              height: '28px'
            }}
          />
        </button>

        <div
          className={`sideNav bg-light ${
            this.props.menuDisp === true ? 'sideNav--show' : 'sideNav--hide'
          }`}
          ref="sideNav"
        >
          {/* marginTop is set to the heght of the header
          so that the items don't get hide beneath header */}
          <ul
            className="menu d-flex flex-column h-100"
            style={{ paddingTop: '60px' }}
          >
            <li>
              <Link
                className="menu-item d-flex align-items-center"
                to="/notes/show"
              >
                <FaRegStickyNote width="50px" height="50px" />
                {open ? (
                  <div className="menu-item-text">My notebook</div>
                ) : null}
              </Link>
            </li>
            <li>
              <Link className="menu-item d-flex align-items-center" to="/xlist">
                <FaRegListAlt width="50px" height="50px" />
                {open ? <div className="menu-item-text">X-List</div> : null}
              </Link>
            </li>
            <li>
              <Link
                className="menu-item d-flex align-items-center"
                to="/shared"
              >
                <MdPeopleOutline width="50px" height="50px" />
                {open ? (
                  <div className="menu-item-text">Shared with me</div>
                ) : null}
              </Link>
            </li>
            <hr
              style={{
                height: '1px',
                width: '100%',
                background: 'lightgray',
                border: 'none'
              }}
            />
            <li className="mt-auto">
              <Link className="menu-item d-flex align-items-center" to="/help">
                <div className="menu-item-icon">
                  <MdHelpOutline width="50px" height="50px" />
                </div>
                {open ? <div className="menu-item-text">Help</div> : null}
              </Link>
            </li>
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
