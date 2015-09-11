module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserSync: {
            bsFiles: {
                src: ['src/*.js', 'demo/*.js', 'demo/*.html', 'demo/*.css']
            },
            options: {
                startPath: 'demo/index.html',
                server: {
                    baseDir: ['./' ],
                    index: "index.html"
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-browser-sync');

    // Default task(s).

};
