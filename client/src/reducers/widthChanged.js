import { WIDTH_CHANGED } from '../actions/types';

const initialState = 0;

export default (prvState = initialState, action) => {
  if (action.type === WIDTH_CHANGED) {
    return !prvState;
  }
  return prvState;
};
