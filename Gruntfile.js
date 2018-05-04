module.exports = function(grunt) {

    grunt.initConfig({
        jshint: {
            files: [
                'Gruntfile.js',
                'app.js',
                'public/javascripts/**/*.js',
                '!public/javascripts/**/*.min.js',
                'routes/**/*.js'
            ],
            options: {
                globals: {
                    jQuery: true
                }
            }
        },
        uglify: {
            application: {
                files: {
                    'public/javascripts/application.min.js': [
                        'public/javascripts/**/*.js',
                        '!public/javascripts/**/*.min.js',
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.registerTask('default', ['jshint', 'uglify']);

};