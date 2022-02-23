/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * 'License'); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
*/
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['build', 'deploy'],
        'http-server': {
            'dev': {
                // the server root directory
                root: process.cwd(),
                port: 8282,
                host: '127.0.0.1',
                cache: 0,
                showDir : true,
                autoIndex: true,
                // server default file extension
                ext: 'html',
                // run in parallel with other tasks
                runInBackground:false
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
            },
            files:["."]
        }
    });

    // external tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-http-server');

    // custom tasks
    grunt.loadTasks('tasks');

    // defaults
    grunt.registerTask('default', ['deploy']);
    grunt.registerTask('build', ['deploy']);
    grunt.registerTask('serve', ['http-server']);
};
