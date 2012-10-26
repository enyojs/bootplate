@ECHO OFF
setlocal enableDelayedExpansion

:: the deploy target folder
SET FOLDER=deploy

:: the deploy target suffix, i.e. <projectName>[suffix]
SET SUFFIX= - %date% - %time%

:: remove spaces, convert / : to _, convert . to ~
set SUFFIX=%SUFFIX: =%
set SUFFIX=%SUFFIX:/=-%
set SUFFIX=%SUFFIX::=-%
set SUFFIX=%SUFFIX:.=~%

:: enyo location
SET ENYO=..\enyo

:: the grandparent folder for this batch file
SET SOURCE=%~dp0..\

:: extract project folder name
FOR /D %%I IN ("%SOURCE%\.") DO SET NAME=%%~nxI

:: prepare target name
SET DEPLOY=%NAME%%SUFFIX%

:: make sure (deploy) FOLDER exists
SET TARGETROOT="%SOURCE%%FOLDER%"
IF NOT EXIST %TARGETROOT% mkdir %TARGETROOT%

:: pull path for this deploy
IF NOT DEFINED TARGET SET TARGET="%SOURCE%%FOLDER%\%DEPLOY%"

:: quotes around path that might have spaces
SET SOURCE="%SOURCE%"

IF NOT EXIST %TARGET% GOTO deploy

ECHO "%TARGET%" folder already exists, please rename or remove it and try again.
ECHO.

PAUSE
GOTO end

:DEPLOY

SET USAGE="Usage: deploy.bat [-h] [-c] [-o output_dir]"

:: Parse options
:: Thanks to http://stackoverflow.com/questions/3973824/windows-bat-file-optional-argument-parsing
set "options=-o:"" -h: -c:"
for %%O in (%options%) do for /f "tokens=1,* delims=:" %%A in ("%%O") do set "%%A=%%~B"
:parseloop
if not "%~1"=="" (
  set "test=!options:*%~1:=! "
  if "!test!"=="!options! " (
  	echo %USAGE%
  	goto end
  ) else if "!test:~0,1!"==" " (
    set "%~1=1"
  ) else (
    set "%~1=%~2"
    shift
  )
  shift
  goto :parseloop
)

:: Handle options
IF DEFINED -h (
	ECHO %USAGE%
	GOTO end	
)
IF DEFINED -c (
	SET NO_LESS="-no-less"
) else (
	SET NO_LESS=""
)
IF DEFINED -o (
	SET TARGET=%-o%
)
IF DEFINED -o (
	RMDIR /S /Q %TARGET%
)

ECHO This script can create a deployment in %TARGET%
ECHO.


ECHO ==========
ECHO build step
ECHO ==========
ECHO.

REM build enyo
CALL "%ENYO%\minify\minify.bat"

REM build app
CALL "%ENYO%\tools\minify.bat" package.js -output ..\build\app

ECHO =========
ECHO copy step
ECHO =========
ECHO.

:: make deploy folder
MKDIR %TARGET%

:: copy root folder files
COPY %SOURCE%index.html %TARGET% >NUL
COPY %SOURCE%icon.png %TARGET% >NUL

:: copy assets and build
XCOPY %SOURCE%assets\*.* %TARGET%\assets\ /Q /E >NUL
XCOPY %SOURCE%build\*.* %TARGET%\build\ /Q /E >NUL

:: copy library items
MKDIR %TARGET%\lib

FOR /D %%G in (%SOURCE%lib\*) DO IF EXIST "%%G\deploy.bat" ECHO deploying "%%~nxG"
FOR /D %%G in (%SOURCE%lib\*) DO IF EXIST "%%G\deploy.bat" CALL "%%G\deploy.bat" %TARGET%\lib\"%%~nxG"

FOR /D %%G in (%SOURCE%lib\*) DO IF NOT EXIST "%%G\deploy.bat" ECHO copying "%%~nxG"
FOR /D %%G in (%SOURCE%lib\*) DO IF NOT EXIST "%%G\deploy.bat" XCOPY "%%G" %TARGET%\lib\"%%~nxG"\ /Q /E >NUL

ECHO.

PAUSE
:end
