import parseLst from '../services/LstParser';
import { UPDATE_ASM } from './types';

export function updateAsm(asm) {
  return { type: UPDATE_ASM, asm };
}

export function compile(code) {
  return async (dispatch, getState, { compiler }) => {
    const result = await compiler.compile(code);
    if (!result.canceled) {
      const asm = parseLst(result.lst);
      dispatch(updateAsm(asm));
    }
  };
}