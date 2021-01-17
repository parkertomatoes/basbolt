import { UPDATE_ASM } from '../actions/types'

const initialState = {
  asm: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_ASM':
      return { ...state, asm: action.asm };
      
    default:
      return state;
  }
}
