import { MENU_TOGGLE, WIDTH_CHANGED } from './types';

export default () => {
  return {
    type: MENU_TOGGLE
  };
};

export const widthChanged = () => {
  return {
    type: WIDTH_CHANGED
  };
};
