module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserSync: {
            bsFiles: {
                src: ['dist/*.js', 'demo/*.js', 'demo/*.html', 'demo/*.css']
            },
            options: {
                watchTask: true,
                startPath: 'demo/index.html',
                server: {
                    baseDir: ['./'],
                    index: "index.html"
                }
            }
        },
        concat: {
            options: {
                separator: ';',
                banner: '(function() {"use strict";',
                footer: '}).call(this);'
            },
            dist: {
                src: ['src/graph.js', 'src/adaptor.js', 'src/layout.js', 'src/module.js'],
                dest: 'dist/graph-layout.js',
            },
        },
        watch: {
            scripts: {
                files: ['src/*.js'],
                tasks: ['concat'],
                options: {
                    spawn: false,
                },
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['browserSync', 'watch']);
    grunt.registerTask('build', ['concat']);

};
