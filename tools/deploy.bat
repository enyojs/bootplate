@ECHO OFF

REM the deploy target folder
SET FOLDER=deploy

REM the deploy target suffix, i.e. <projectName>[suffix]
SET SUFFIX= - %date% - %time%

REM remove spaces, convert / : to _, convert . to ~
set SUFFIX=%SUFFIX: =%
set SUFFIX=%SUFFIX:/=-%
set SUFFIX=%SUFFIX::=-%
set SUFFIX=%SUFFIX:.=~%

REM enyo location
SET ENYO=..\enyo

REM the grandparent folder for this batch file
SET SOURCE=%~dp0..\

REM extract project folder name
FOR /D %%I IN ("%SOURCE%\.") DO SET NAME=%%~nxI

REM prepare target name
SET DEPLOY=%NAME%%SUFFIX%

REM make sure (deploy) FOLDER exists
SET TARGET="%SOURCE%%FOLDER%"
IF NOT EXIST %TARGET% mkdir %TARGET%

REM pull path for this deploy
SET TARGET="%SOURCE%%FOLDER%\%DEPLOY%"

REM quotes around path that might have spaces
SET SOURCE="%SOURCE%"

ECHO This script can create a deployment in %TARGET%
ECHO.

IF NOT EXIST %TARGET% GOTO deploy

ECHO "%DEPLOY%" folder already exists, please rename or remove it and try again.
ECHO.

PAUSE
EXIT

:DEPLOY

ECHO ==========
ECHO build step
ECHO ==========
ECHO.

REM build enyo
CALL %ENYO%\minify\minify.bat

REM build app
CALL %ENYO%\tools\minify.bat package.js -output ..\build\app

ECHO =========
ECHO copy step
ECHO =========
ECHO.

REM make deploy folder
MKDIR %TARGET%

REM copy root folder files
COPY %SOURCE%index.html %TARGET% >NUL
COPY %SOURCE%icon.png %TARGET% >NUL

REM copy assets and build
XCOPY %SOURCE%assets\*.* %TARGET%\assets\ /Q /E >NUL
XCOPY %SOURCE%build\*.* %TARGET%\build\ /Q /E >NUL

REM copy library items
MKDIR %TARGET%\lib

FOR /D %%G in (%SOURCE%lib\*) DO IF EXIST "%%G\deploy.bat" ECHO deploying "%%~nxG"
FOR /D %%G in (%SOURCE%lib\*) DO IF EXIST "%%G\deploy.bat" CALL "%%G\deploy.bat" %TARGET%\lib\"%%~nxG"

FOR /D %%G in (%SOURCE%lib\*) DO IF NOT EXIST "%%G\deploy.bat" ECHO copying "%%~nxG"
FOR /D %%G in (%SOURCE%lib\*) DO IF NOT EXIST "%%G\deploy.bat" XCOPY "%%G" %TARGET%\lib\"%%~nxG"\ /Q /E >NUL

ECHO.

PAUSE