/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
*/

var SCRIPT_BAT = "tools/deploy.bat",
    SCRIPT_SH = "tools/deploy.sh";

var path = require("path");
var spawn = require("child_process").spawn;

module.exports = function(grunt) {
    grunt.registerTask("deploy", "Builds and deploys the bootplate", function() {
        var done = this.async();
        var cwd = process.cwd();
        var child;
        if(process.platform.indexOf("win")===0) {
            child = spawn(process.env.COMSPEC || "cmd.exe", ["/c", path.join(cwd, SCRIPT_BAT)], {stdio: "inherit", cwd:cwd});
        } else {
            child = spawn(process.env.SHELL || "sh", [path.join(cwd, SCRIPT_SH)], {stdio: "inherit", cwd:cwd});
        }
        child.on("close", function(code) {
            if(code===0) {
                done();
            } else {
                done(false);
            }
        });
    });
}
