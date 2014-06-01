module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    // This line makes your node configurations available for use
    pkg: grunt.file.readJSON('package.json'),
    // This is where we configure JSHint
    jshint: {
      options: {
        node: true,
        globals: {
          angular: true
        }
      },
      // You get to make the name
      // The paths tell JSHint which files to validate
      myFiles: ['app/**/*.js', 'config/**/*.js', 'public/application.js']
    }
  });
  // Each plugin must be loaded following this pattern
  grunt.loadNpmTasks('grunt-contrib-jshint');

};
