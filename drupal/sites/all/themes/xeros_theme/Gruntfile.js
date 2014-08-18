module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        compass: {
            dist: {
                options: {
                    config: 'config.rb'
                }
            }
        },
        watch: {
            sass: {
                files: ['**/*.scss','../../modules/**/*.scss'],
                tasks: ['compass:dist' ],
                nocache: 'true'
            },
            css: {
                files: ['*.css']
            },
            livereload: {
                files: ['css/*.css'],
                options: { livereload: true }
            }
        }
    });

 //   grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');

    grunt.registerTask('default', ['watch']);

};
