module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Clean the cache
    clean: {
      cache: 'cache/*.pdf'
    },

    // Compile stylesheets
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
          'public/css/highlight.css': 'public/scss/highlight.scss'
        }
      }
    },

    // watch: {
    //   files: ['<%= jshint.files %>'],
    //   tasks: ['jshint', 'qunit']
    // }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('test', []);

  grunt.registerTask('default', ['clean', 'sass']);

};