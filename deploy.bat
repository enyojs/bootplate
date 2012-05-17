@ECHO OFF

REM the location of this batch file
SET SOURCE=%~dp0

REM extract project folder name
FOR /D %%I IN ("%SOURCE%\.") DO SET NAME=%%~nxI

REM target names
SET DEPLOY=%NAME%-deploy
SET TARGET="%SOURCE%..\%DEPLOY%"
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

REM FIXME: we push/pop to satisfy minify.bat requirement that package.js be in CWD

PUSHD "%CD%"
CD "%SOURCE%/minify"

REM build enyo
CALL ..\enyo\minify\minify.bat

REM build app
CALL ..\enyo\tools\minify.bat package.js -output ..\build\app

POPD

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