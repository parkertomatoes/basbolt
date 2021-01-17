DECLARE FUNCTION ReadLine$ ()
DECLARE SUB HandleCompileSource ()

CONST buffersize& = 16384
DIM SHARED buffer AS STRING * 16384

segment& = VARSEG(buffer)
IF segment& < 0 THEN segment& = 1 - segment&
pointer& = VARPTR(buffer)
IF pointer& < 0 THEN pointer& = 1 - pointer&
bufferaddr& = segment& * 16 + pointer&

PRINT USING "(buffer&, size&) "; STR$(bufferaddr&); STR$(buffersize&);
DO WHILE 1

    PRINT "ready"
    SELECT CASE ReadLine$
        CASE "compile":
            HandleCompileSource
        CASE "exit"
            EXIT DO
    END SELECT

LOOP

SUB HandleCompileSource
    path$ = ReadLine$
    sourcesize& = VAL(ReadLine$)
    remaining& = sourcesize&

    OPEN path$ FOR BINARY ACCESS WRITE AS #1

    ' erase the old file if it exists
    IF LOF(1) > 0 THEN
        CLOSE #1
        KILL path$
        OPEN path$ FOR BINARY ACCESS WRITE AS #1
    END IF

    ' copy source from stdin to file
    DO WHILE remaining& > buffersize&
        PRINT "ready"
        signal$ = INPUT$(1)
        PUT #1,, buffer
        remaining& = remaining& - buffersize&
    LOOP
    IF remaining& > 0 THEN
        PRINT "ready"
        signal$ = INPUT$(1)
        tempbuf$ = MID$(buffer, 1, remaining&)
        PUT #1,, tempbuf$
    END IF
    PRINT "received"
    CLOSE #1

    ' compile source
    objpath$ = path$
    MID$(objpath$, LEN(objpath$) - 2, 3) = "OBJ"
    lstpath$ = path$
    MID$(lstpath$, LEN(lstpath$) - 2, 3) = "LST"
    SHELL "C:\\QBX\\BINB\\BC.EXE /A /O " + path$ + " " + objpath$ + " " + lstpath$ + ">NUL"

    ' output listfile
    OPEN lstpath$ FOR BINARY ACCESS READ AS #1
    remaining& = LOF(1)
    PRINT USING "(size&) done"; STR$(remaining&)

    DO WHILE remaining& > buffersize&
        GET #1,, buffer
        PRINT "ready"
        signal$ = INPUT$(1)
        remaining& = remaining& - buffersize&
    LOOP
    IF remaining& > 0 THEN
        tempbuf$ = SPACE$(remaining&)
        GET #1,, tempbuf$
        MID$(buffer, 1, remaining&) = tempbuf$
        PRINT "ready"
        signal$ = INPUT$(1)
    END IF
    CLOSE #1
END SUB

' LINE INPUT without echo
FUNCTION ReadLine$
    result$ = ""
    DO WHILE 1
        char$ = INPUT$(1)
        charcode% = ASC(char$)
        SELECT CASE charcode%
            CASE &H0A
                EXIT DO
            CASE &H0D
                ' ignore carriage returns during prompts
            CASE ELSE
                result$ = result$ + char$
        END SELECT
    LOOP
    ReadLine$ = result$
END FUNCTION