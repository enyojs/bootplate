@REM don't watch the sausage being made
@ECHO OFF

REM the folder this script is in (*/bootplate/tools)
SET TOOLS=%~DP0

REM application source location
SET SRC=%TOOLS%..

REM enyo location
SET ENYO=%SRC%\enyo

REM deploy script location
SET DEPLOY=%ENYO%\tools\deploy.js

REM node location
SET NODE=node.exe

REM use node to invoke deploy.js with imported parameters
ECHO %NODE% "%DEPLOY%" -T -s "%SRC%" -o "%SRC%\deploy" %*
%NODE% "%DEPLOY%" -T -s "%SRC%" -o "%SRC%\deploy" %*
IF ERRORLEVEL 1 GOTO err

REM copy files and package if deploying to cordova webos
:again
if not "%1" == "" (

    if "%1" == "--cordova-webos" (
	REM copy appinfo.json and cordova*.js files
	for %%A in ("%~dp0./..") do SET DEST=%TOOLS%..\deploy\
	copy %SRC%\appinfo.json %DEST%
	IF ERRORLEVEL 1 GOTO err
	copy %SRC%\cordova*.js %DEST%
	IF ERRORLEVEL 1 GOTO err

	REM package it up
	if not exist %SRC%\bin mkdir %SRC%\bin
	palm-package.bat %DEST% --outdir=%SRC%\bin
    )

    shift
    goto again
)

goto done

:err
ECHO Deploy encountered errors.
EXIT /B 1

:done
