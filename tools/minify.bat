REM build enyo
@CALL ..\enyo\minify\minify.bat

REM build app
@CALL ..\enyo\tools\minify.bat package.js -output ..\build\app

pause