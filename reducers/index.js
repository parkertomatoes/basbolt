import { UPDATE_ASM, OPEN_HELP, START_COMPILE, STOP_COMPILE } from '../actions/types'

const initialState = {
  asm: null,
  article: null,
  isCompiling: true
};

export default (state = initialState, action) => {
  switch (action.type) {
    case START_COMPILE:
      return { ...state, isCompiling: true };

    case STOP_COMPILE:
      return { ...state, isCompiling: false };

    case UPDATE_ASM:
      return { ...state, asm: action.asm };

    case OPEN_HELP:
      // use a new object each time so that triggers an effect each dispatch
      return { ...state, article: { fragment: action.article } };
      
    default:
      return state;
  }
}
