import { MENU_TOGGLE } from '../actions/types';

const toggleMenu = false;
const body = document.querySelector('body');

export default (prvState = toggleMenu, action) => {
  if (action.type === MENU_TOGGLE) {
    if (window.innerWidth <= 576 && !prvState)
      body.style.width = `${250 + window.innerWidth}px`;
    else body.style.width = '100%';

    return !prvState;
  }
  return prvState;
};
