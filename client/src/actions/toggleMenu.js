import { MENU_TOGGLE } from './types';

const toggleMenu = () => {
  console.log('inside action toggle_menu');
  return {
    type: MENU_TOGGLE
  };
};

export default toggleMenu;
