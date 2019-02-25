import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import toggleMenu from '../actions/toggleMenu';
import hamburger from '../images/hamburger.png';
import Notes from '../images/notes.png';
import Xlist from '../images/xlist.png';
import Template from '../images/template.png';
import Logout from '../images/logout.png';
import Help from '../images/help.png';

class Scrollspy extends React.Component {
  static propTypes = {
    menuDisp: PropTypes.bool.isRequired,
    toggleMenu: PropTypes.bool.isRequired
  };

  /*
    Dispatches the action to toggle the menu state
  */
  menuToggle = () => {
    console.log(`${this.props.toggleMenu} : inside the scrollspy`);
    this.props.toggleMenu();
  };

  render() {
    const open = this.props.menuDisp;

    return (
      <div>
        <img
          src={hamburger}
          alt="hamburger-menu"
          width="40px"
          height="40px"
          className="img-hamburger"
          style={{ position: 'fixed', top: 10, left: 15, zIndex: 10000 }}
          ref="hamburger_menu"
          onClick={this.menuToggle}
          onKeyDown={this.menuToggle}
        />

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
            style={{ marginTop: '60px' }}
          >
            <Link className="menu-item" to="/notes">
              <div className="menu-item-icon">
                <img src={Notes} width="50px" alt="notes" height="50px" />
              </div>
              {open ? <div className="menu-item-text">Notes</div> : null}
            </Link>
            <Link className="menu-item" to="/xlist">
              <div className="menu-item-icon">
                <img src={Xlist} width="50px" alt="notes" height="50px" />
              </div>
              {open ? <div className="menu-item-text">X-List</div> : null}
            </Link>
            <Link className="menu-item" to="/template">
              <div className="menu-item-icon">
                <img src={Template} width="50px" alt="notes" height="50px" />
              </div>
              {open ? <div className="menu-item-text">Template</div> : null}
            </Link>
            <Link className="menu-item" to="/changeIt">
              <div className="menu-item-icon">
                <img src={Template} width="50px" alt="notes" height="50px" />
              </div>
              {open ? (
                <div className="menu-item-text">ChangeItAndIcon</div>
              ) : null}
            </Link>
            <div
              className="d-flex flex-column"
              style={{ 'margin-top': 'auto' }}
            >
              <hr width="50px" />

              <Link className="menu-item" to="/help">
                <div className="menu-item-icon">
                  <img src={Help} width="50px" alt="notes" height="50px" />
                </div>
                {open ? <div className="menu-item-text">Help</div> : null}
              </Link>

              <Link className="menu-item" to="/">
                <div className="menu-item-icon">
                  <img src={Logout} width="50px" alt="notes" height="50px" />
                </div>
                {open ? <div className="menu-item-text">Log Out</div> : null}
              </Link>
            </div>
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
