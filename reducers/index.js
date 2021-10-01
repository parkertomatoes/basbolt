import { UPDATE_ASM, OPEN_HELP } from '../actions/types'

const initialState = {
  asm: null,
  article: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ASM:
      return { ...state, asm: action.asm };

    case OPEN_HELP:
      // use a new object each time so that triggers an effect each dispatch
      return { ...state, article: { fragment: action.article } };
      
    default:
      return state;
  }
}
