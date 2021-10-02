import { UPDATE_ASM, OPEN_HELP, START_COMPILE, STOP_COMPILE, SELECT_COMPILER, UPDATE_SOURCE } from '../actions/types'

const initialState = {
  asm: null,
  article: null,
  isCompiling: true,
  compiler: 'QB45',
  source: 'PRINT "HELLO WORLD"'
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

    case SELECT_COMPILER:
      return { ...state, compiler: action.compiler };

    case UPDATE_SOURCE:
      return { ...state, source: action.source };
      
    default:
      return state;
  }
}
