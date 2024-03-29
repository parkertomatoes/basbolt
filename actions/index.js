import parseLst from '../services/LstParser';
import { UPDATE_ASM, OPEN_HELP, START_COMPILE, STOP_COMPILE, SELECT_COMPILER, UPDATE_SOURCE } from './types';

export function updateAsm(asm) {
  return { type: UPDATE_ASM, asm };
}

function startCompile() {
  return { type: START_COMPILE };
}

function stopCompile() {
  return { type: STOP_COMPILE };
}

export function compile() {
  return async (dispatch, getState, { compiler }) => {
    const state = getState();
    const options = {
      onBegin: () => dispatch(startCompile()),
      onEnd: () => dispatch(stopCompile()),
      compiler: state.compiler
    };
    const result = await compiler.compile(state.source, options);
    if (!result.canceled && result.lst) {
      const asm = parseLst(result.lst);
      dispatch(updateAsm(asm));
    }
  }
}

function pushUpdateSource(source) {
  return { type: UPDATE_SOURCE, source };
}

export function updateSource(source, compiler) {
  return dispatch => {
    dispatch(pushUpdateSource(source));
    dispatch(compile());
  };
}

function pushSelectCompiler(compiler) {
  return { type: SELECT_COMPILER, compiler };
}

export function selectCompiler(compiler) {
  return dispatch => {
    dispatch(pushSelectCompiler(compiler));
    dispatch(compile());
  }
}

export const DEFAULT_ARTICLE =  '#topic-qb45qck-T0000';
const ARTICLES = new Map([
  ['ABS', '#topic-qb45qck-T000A'],
  ['ABSOLUTE', '#topic-qb45qck-T001B'],
  ['ACCESS', '#topic-qb45qck-T000B'],
  ['ALIAS', '#topic-qb45qck-T000C'],
  ['AND', '#topic-qb45qck-T000D'],
  ['ANY', '#topic-qb45qck-T000E'],
  ['APPEND', '#topic-qb45qck-T000F'],
  ['AS', '#topic-qb45qck-T0010'],
  ['ASC', '#topic-qb45qck-T0011'],
  ['ATN', '#topic-qb45qck-T0012'],
  ['BASE', '#topic-qb45qck-T007D'],
  ['BASE', '#topic-qb45qck-T007D'],
  ['BASIC', '#topic-qb45advr-T000C'],
  ['BEEP', '#topic-qb45qck-T0013'],
  ['BINARY', '#topic-qb45qck-T0015'],
  ['BLOAD', '#topic-qb45qck-T0016'],
  ['BSAVE', '#topic-qb45qck-T0017'],
  ['BYVAL', '#topic-qb45qck-T0018'],
  ['CALL', '#topic-qb45qck-T0019'],
  ['CALLS', '#topic-qb45qck-T001A'],
  ['CASE', '#topic-qb45qck-T009E'],
  ['CDBL', '#topic-qb45qck-T001D'],
  ['CDECL', '#topic-qb45qck-T0033'],
  ['CHAIN', '#topic-qb45qck-T001E'],
  ['CHDIR', '#topic-qb45qck-T001F'],
  ['CHR', '#topic-qb45qck-T0020'],
  ['CINT', '#topic-qb45qck-T0021'],
  ['CIRCLE', '#topic-qb45qck-T0022'],
  ['CLEAR', '#topic-qb45qck-T0023'],
  ['CLNG', '#topic-qb45qck-T0024'],
  ['CLOSE', '#topic-qb45qck-T0025'],
  ['CLS', '#topic-qb45qck-T0026'],
  ['COLOR', '#topic-qb45qck-T0027'],
  ['COM', '#topic-qb45qck-T0028'],
  ['COMMAND', '#topic-qb45qck-T0029'],
  ['COMMON', '#topic-qb45qck-T002A'],
  ['CONST', '#topic-qb45qck-T002B'],
  ['COS', '#topic-qb45qck-T002C'],
  ['CSNG', '#topic-qb45qck-T002D'],
  ['CSRLIN', '#topic-qb45qck-T002E'],
  ['CVD', '#topic-qb45qck-T0030'],
  ['CVDMBF', '#topic-qb45qck-T002F'],
  ['CVI', '#topic-qb45qck-T0030'],
  ['CVL', '#topic-qb45qck-T0030'],
  ['CVS', '#topic-qb45qck-T0030'],
  ['CVSMBF', '#topic-qb45qck-T002F'],
  ['DATA', '#topic-qb45advr-T0010'],
  ['DATE', '#topic-qb45qck-T0032'],
  ['DECLARE', '#topic-qb45qck-T0034'],
  ['DEF', '#topic-qb45qck-T0035'],
  ['DEFDBL', '#topic-qb45qck-T0037'],
  ['DEFINT', '#topic-qb45qck-T0037'],
  ['DEFLNG', '#topic-qb45qck-T0037'],
  ['DEFSNG', '#topic-qb45qck-T0037'],
  ['DEFSTR', '#topic-qb45qck-T0037'],
  ['DIM', '#topic-qb45qck-T0038'],
  ['DO', '#topic-qb45qck-T003A'],
  ['DOUBLE', '#topic-qb45qck-T005C'],
  ['DRAW', '#topic-qb45qck-T003B'],
  ['DYNAMIC', '#topic-qb45advr-T0040'],
  ['ELSE', '#topic-qb45qck-T0054'],
  ['ELSEIF', '#topic-qb45qck-T0054'],
  ['END', '#topic-qb45qck-T003C'],
  ['ENDIF', '#topic-qb45qck-T0054'],
  ['ENVIRON', '#topic-qb45qck-T003D'],
  ['EOF', '#topic-qb45qck-T003F'],
  ['EQV', '#topic-qb45qck-T0040'],
  ['ERASE', '#topic-qb45qck-T0041'],
  ['ERDEV', '#topic-qb45qck-T0042'],
  ['ERL', '#topic-qb45qck-T0043'],
  ['ERR', '#topic-qb45qck-T0043'],
  ['ERROR', '#topic-qb45qck-T0044'],
  ['EXIT', '#topic-qb45qck-T0045'],
  ['EXP', '#topic-qb45qck-T0046'],
  ['FIELD', '#topic-qb45qck-T0047'],
  ['FILEATTR', '#topic-qb45qck-T0048'],
  ['FILES', '#topic-qb45qck-T0049'],
  ['FIX', '#topic-qb45qck-T004A'],
  ['FOR', '#topic-qb45qck-T004B'],
  ['FRE', '#topic-qb45qck-T004C'],
  ['FREEFILE', '#topic-qb45qck-T004D'],
  ['FUNCTION', '#topic-qb45qck-T004E'],
  ['GET', '#topic-qb45qck-T004F'],
  ['GOSUB', '#topic-qb45advr-T004A'],
  ['GOTO', '#topic-qb45advr-T004A'],
  ['HEX', '#topic-qb45qck-T0053'],
  ['IF', '#topic-qb45qck-T0054'],
  ['IMP', '#topic-qb45qck-T0055'],
  ['INCLUDE', '#topic-qb45advr-T003F'],
  ['INKEY', '#topic-qb45qck-T0056'],
  ['INP', '#topic-qb45qck-T0057'],
  ['INPUT', '#topic-qb45qck-T0058'],
  ['INSTR', '#topic-qb45qck-T005A'],
  ['INT', '#topic-qb45qck-T005B'],
  ['INTEGER', '#topic-qb45qck-T005C'],
  ['INTERRUPT', '#topic-qb45qck-T001C'],
  ['IOCTL', '#topic-qb45qck-T005D'],
  ['IS', '#topic-qb45qck-T009E'],
  ['KEY', '#topic-qb45advr-T0045'],
  ['KILL', '#topic-qb45qck-T0060'],
  ['LBOUND', '#topic-qb45qck-T0061'],
  ['LCASE', '#topic-qb45qck-T0062'],
  ['LEFT', '#topic-qb45qck-T0063'],
  ['LEN', '#topic-qb45qck-T0064'],
  ['LET', '#topic-qb45qck-T0065'],
  ['LINE', '#topic-qb45qck-T0066'],
  ['LIST', '#topic-qb45qck-T005F'],
  ['LOC', '#topic-qb45qck-T0067'],
  ['LOCAL', '#topic-qb45qck-T0009'],
  ['LOCATE', '#topic-qb45qck-T0068'],
  ['LOCK', '#topic-qb45qck-T0069'],
  ['LOF', '#topic-qb45qck-T006A'],
  ['LOG', '#topic-qb45qck-T006B'],
  ['LONG', '#topic-qb45qck-T005C'],
  ['LOOP', '#topic-qb45qck-T003A'],
  ['LPOS', '#topic-qb45qck-T006C'],
  ['LPRINT', '#topic-qb45qck-T006D'],
  ['LSET', '#topic-qb45qck-T006E'],
  ['LTRIM', '#topic-qb45qck-T0070'],
  ['MID', '#topic-qb45advr-T0048'],
  ['MKD', '#topic-qb45qck-T0074'],
  ['MKDIR', '#topic-qb45qck-T0072'],
  ['MKDMBF', '#topic-qb45qck-T0073'],
  ['MKI', '#topic-qb45qck-T0074'],
  ['MKL', '#topic-qb45qck-T0074'],
  ['MKS', '#topic-qb45qck-T0074'],
  ['MKSMBF', '#topic-qb45qck-T0073'],
  ['MOD', '#topic-qb45qck-T0075'],
  ['NAME', '#topic-qb45qck-T0076'],
  ['NEXT', '#topic-qb45qck-T004B'],
  ['NOT', '#topic-qb45qck-T0078'],
  ['OCT', '#topic-qb45qck-T0079'],
  ['OFF', '#topic-qb45qck-T007A'],
  ['ON', '#topic-qb45advr-T004A'],
  ['OPEN', '#topic-qb45qck-T007C'],
  ['OPTION', '#topic-qb45qck-T007D'],
  ['OR', '#topic-qb45qck-T007E'],
  ['OUT', '#topic-qb45qck-T007F'],
  ['OUTPUT', '#topic-qb45qck-T0080'],
  ['PAINT', '#topic-qb45qck-T0081'],
  ['PALETTE', '#topic-qb45qck-T0082'],
  ['PCOPY', '#topic-qb45qck-T0083'],
  ['PEEK', '#topic-qb45qck-T0084'],
  ['PEN', '#topic-qb45advr-T004D'],
  ['PLAY', '#topic-qb45advr-T004E'],
  ['PMAP', '#topic-qb45qck-T0087'],
  ['POINT', '#topic-qb45qck-T0088'],
  ['POKE', '#topic-qb45qck-T0089'],
  ['POS', '#topic-qb45qck-T008A'],
  ['PRESET', '#topic-qb45qck-T008B'],
  ['PRINT', '#topic-qb45qck-T008C'],
  ['PSET', '#topic-qb45qck-T008D'],
  ['PUT', '#topic-qb45qck-T0050'],
  ['RANDOM', '#topic-qb45qck-T0014'],
  ['RANDOMIZE', '#topic-qb45qck-T008E'],
  ['READ', '#topic-qb45qck-T008F'],
  ['REDIM', '#topic-qb45qck-T0090'],
  ['REM', '#topic-qb45qck-T0091'],
  ['RESET', '#topic-qb45qck-T0092'],
  ['RESTORE', '#topic-qb45qck-T0093'],
  ['RESUME', '#topic-qb45qck-T0094'],
  ['RETURN', '#topic-qb45qck-T0095'],
  ['RIGHT', '#topic-qb45qck-T0096'],
  ['RMDIR', '#topic-qb45qck-T0097'],
  ['RND', '#topic-qb45qck-T0098'],
  ['RSET', '#topic-qb45qck-T006F'],
  ['RTRIM', '#topic-qb45qck-T0099'],
  ['RUN', '#topic-qb45qck-T009A'],
  ['SADD', '#topic-qb45qck-T009B'],
  ['SCREEN', '#topic-qb45advr-T0053'],
  ['SEEK', '#topic-qb45advr-T0054'],
  ['SELECT', '#topic-qb45qck-T009E'],
  ['SETMEM', '#topic-qb45qck-T009F'],
  ['SGN', '#topic-qb45qck-T00A0'],
  ['SHARED', '#topic-qb45qck-T00A1'],
  ['SHELL', '#topic-qb45qck-T00A2'],
  ['SIGNAL', '#topic-qb45qck-T0008'],
  ['SIN', '#topic-qb45qck-T00A3'],
  ['SINGLE', '#topic-qb45qck-T005C'],
  ['SLEEP', '#topic-qb45qck-T00A4'],
  ['SOUND', '#topic-qb45qck-T00A5'],
  ['SPACE', '#topic-qb45qck-T00A6'],
  ['SPC', '#topic-qb45qck-T00A7'],
  ['SQR', '#topic-qb45qck-T00A8'],
  ['STATIC', '#topic-qb45qck-T00A9'],
  ['STEP', '#topic-qb45qck-T00AA'],
  ['STICK', '#topic-qb45qck-T00AB'],
  ['STOP', '#topic-qb45qck-T00AC'],
  ['STR', '#topic-qb45qck-T00AD'],
  ['STRIG', '#topic-qb45advr-T0055'],
  ['STRING', '#topic-qb45qck-T005C'],
  ['SUB', '#topic-qb45qck-T00B0'],
  ['SWAP', '#topic-qb45qck-T00B1'],
  ['SYSTEM', '#topic-qb45qck-T00B2'],
  ['TAB', '#topic-qb45qck-T00B3'],
  ['TAN', '#topic-qb45qck-T00B4'],
  ['THEN', '#topic-qb45qck-T0054'],
  ['TIME', '#topic-qb45advr-T0056'],
  ['TIMER', '#topic-qb45advr-T0057'],
  ['TO', '#topic-qb45qck-T00B7'],
  ['TROFF', '#topic-qb45qck-T00B8'],
  ['TRON', '#topic-qb45qck-T00B8'],
  ['TYPE', '#topic-qb45qck-T00B9'],
  ['UBOUND', '#topic-qb45qck-T00BA'],
  ['UCASE', '#topic-qb45qck-T00BB'],
  ['UEVENT', '#topic-qb45qck-T00BC'],
  ['UNLOCK', '#topic-qb45qck-T0069'],
  ['UNTIL', '#topic-qb45qck-T0039'],
  ['USING', '#topic-qb45qck-T00BE'],
  ['VAL', '#topic-qb45qck-T00BF'],
  ['VARPTR', '#topic-qb45qck-T00C0'],
  ['VARSEG', '#topic-qb45qck-T00C0'],
  ['VIEW', '#topic-qb45qck-T00C2'],
  ['WAIT', '#topic-qb45qck-T00C3'],
  ['WEND', '#topic-qb45qck-T0039'],
  ['WHILE', '#topic-qb45qck-T0039'],
  ['WIDTH', '#topic-qb45qck-T00C4'],
  ['WINDOW', '#topic-qb45qck-T00C5'],
  ['WRITE', '#topic-qb45qck-T00C6'],
  ['XOR', '#topic-qb45qck-T00C7'],
]);

export function openHelp(keyword) {
  return { type: OPEN_HELP, article: ARTICLES.get(keyword) || DEFAULT_ARTICLE };
}