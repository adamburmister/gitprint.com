module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      site: {
        options: {
          style: 'compressed'
        },
        files: {
          'public/css/main.css': 'public/scss/main.scss',
        }
      },
      print: {
        options: {
          style: 'expanded'
        },
        files: {
          'public/css/print.css': 'public/scss/print.scss',
        }
      }
    },

    // watch: {
    //   files: ['<%= jshint.files %>'],
    //   tasks: ['jshint', 'qunit']
    // }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('test', []);

  grunt.registerTask('default', ['sass']);

};