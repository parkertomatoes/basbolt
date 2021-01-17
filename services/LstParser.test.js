import { describe, expect, test } from '@jest/globals'
import parseLst from './LstParser';

const source = `                                                                       PAGE   1\r
                                                                      17 Nov 20\r
                                                                      17:23:11\r
Offset  Data    Source Line           Microsoft (R) BASIC Compiler Version 7.10\r
\r
 0030   0006    SCREEN 13\r
 0030   0006    FOR x = 0 TO 319\r
 0030    **        I00002:   mov     ax,0001h\r
 0033    **                  push    ax\r
 0034    **                  mov     ax,000Dh\r
 0037    **                  push    ax\r
 0038    **                  mov     ax,0002h\r
 003B    **                  push    ax\r
 003C    **                  call    B$CSCN\r
 0041    **                  int     35h\r
 0043    **                  db      06h\r
 0044    **                  dw      <00000000>\r
 0046    **                  jmp     I00003\r
 0049    **                  nop     \r
 004A   0006    FOR y = 0 TO 199\r
 004A    **        I00004:   int     35h\r
 004C    **                  db      06h\r
 004D    **                  dw      <00000000>\r
 004F    **                  jmp     I00005\r
 0052   0006    PSET (x, y), x XOR y\r
 0052   0006    NEXT\r
 0052    **        I00006:   push    X!+0002h\r
 0056    **                  push    X!\r
 005A    **                  push    Y!+0002h\r
 005E    **                  push    Y!\r
 0062    **                  call    B$N1R4\r
 0067    **                  int     35h\r
 0069    **                  db      06h\r
 006A    **                  dw      X!\r
 006C    **                  call    B$FIST\r
 0071    **                  int     35h\r
 0073    **                  db      06h\r
 0074    **                  dw      Y!\r
 0076    **                  mov     0ECh[bp],dx\r
 0079    **                  mov     0EAh[bp],ax\r
 007C    **                  call    B$FIST\r
 0081    **                  xor     ax,0EAh[bp]\r
 0084    **                  xor     dx,0ECh[bp]\r
 0087    **                  push    ax\r
 0088    **                  call    B$PSTC\r
 008D    **                  int     35h\r
 008F    **                  db      06h\r
 0090    **                  dw      Y!\r
 0092    **                  int     34h\r
 0094    **                  db      06h\r
 0095    **                  dw      <0000803F>\r
 0097    **        I00005:   int     35h\r
 0099    **                  db      1Eh\r
 009A    **                  dw      Y!\r
 009C    **                  int     3Dh\r
 009E    **                  int     35h\r
 00A0    **                  db      06h\r
 00A1    **                  dw      <00004743>\r
 00A3    **                  int     35h\r
                                                                      PAGE   2\r
                                                                      17 Nov 20\r
                                                                      17:23:11\r
Offset  Data    Source Line           Microsoft (R) BASIC Compiler Version 7.10\r
\r
 00A5    **                  db      06h\r
 00A6    **                  dw      Y!\r
 00A8    **                  int     3Dh\r
 00AA    **                  call    B$FCMP\r
 00AF    **                  jna     I00006\r
 00B1   000E    NEXT\r
 00B1    **                  int     35h\r
 00B3    **                  db      06h\r
 00B4    **                  dw      X!\r
 00B6    **                  int     34h\r
 00B8    **                  db      06h\r
 00B9    **                  dw      <0000803F>\r
 00BB    **        I00003:   int     35h\r
 00BD    **                  db      1Eh\r
 00BE    **                  dw      X!\r
 00C0    **                  int     3Dh\r
 00C2    **                  int     35h\r
 00C4    **                  db      06h\r
 00C5    **                  dw      <00809F43>\r
 00C7    **                  int     35h\r
 00C9    **                  db      06h\r
 00CA    **                  dw      X!\r
 00CC    **                  int     3Dh\r
 00CE    **                  call    B$FCMP\r
 00D3    **                  ja      $+03h\r
 00D5    **                  jmp     I00004\r
 00D8   000E    'gonna print soon\r
 00D8   000E    \r
 00D8   000E    'real soon\r
 00D8   000E    print "Hello World! This is a very long line that is hopefully \r
                more than 80 characters so I can test something"\r
 00D8   000E    \r
 00D8    **                  mov     ax,offset <const>\r
 00DB    **                  push    ax\r
 00DC    **                  call    B$PESD\r
 00E1    **                  call    B$CENP\r
 00E6   000E    \r
\r
46056 Bytes Available\r
45389 Bytes Free\r
\r
    0 Warning Error(s)\r
    0 Severe  Error(s)`;

test('parses correctly', () => {
    const lst = parseLst(source);
    lst.length > 0;
    expect(lst[0].offset).toBe(48);
    expect(lst[0].data).toBe(6);
    expect(lst[0].text.length).toBeGreaterThan(0);
    expect(lst[0].asm.length).toBe(0);
    expect(lst[1].offset).toBe(48);
    expect(lst[1].data).toBe(6);
    expect(lst[0].text.length).toBeGreaterThan(0);
    expect(lst[0].asm.length).toBe(0);
});

const sourceWrap = `                                                                      PAGE   1\r
                                                                      22 Nov 20\r
                                                                      19:49:05\r
Offset  Data    Source Line           Microsoft (R) BASIC Compiler Version 7.10\r
\r
 0030   0006                                                   pri' this i a ve\r
                ry long line\r
                                                                  ^\u0007 Equal sign\r
                 missing\r
 0030    **        I00002:   call    B$CENP\r
 0035   0006    \r
\r
46056 Bytes Available\r
45978 Bytes Free\r
\r
    0 Warning Error(s)\r
    1 Severe  Error(s)\r
`;

