var path = require('path');

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
    },
    bowercopy: {
      options: {
        srcPrefix: 'bower_components'
      },
      scripts: {
        options: {
          destPrefix: 'public/vendor'
        },
        files: {
          'js/angular.min.js': 'angular/angular.min.js',
          'js/angular-resource.min.js': 'angular-resource/angular-resource.min.js',
          'js/angular-route.min.js': 'angular-route/angular-route.min.js',
          'js/moment.min.js' : 'momentjs/min/moment.min.js'
        }
      }
    },
    ec2: 'config/aws-ec2.json',
    shipit: {
      options: {
        workspace: '.',
        deployTo: '/home/ubuntu/deploy',
        repositoryUrl: 'https://github.com/skinofstars/wedsite.git',
        ignores: ['.git', 'node_modules', 'private', 'bower_components', '.vagrant', 'provisioner'],
        keepReleases: 5
      },
      production: {
        servers: 'ubuntu@54.76.139.102'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-bowercopy');
  grunt.loadNpmTasks('grunt-ec2');
  grunt.loadNpmTasks('grunt-shipit');


  // deploy tasks
  grunt.registerTask('remote:setup', function() {
    grunt.shipit.remote('cd deploy && mkdir -p node_modules bower_components');
  });

  grunt.registerTask('remote:install', function () {
    var p = path.join(grunt.shipit.releasesPath, grunt.shipit.releaseDirname);
    grunt.shipit.remote('cd ' + p + ' && ln -s ~/deploy/node_modules && ln -s ~/deploy/bower_components', this.async())
    // npm install --production
    grunt.shipit.remote('cd ' + p + ' && npm install --production && npm prune && npm rebuild', this.async());
  });

  grunt.registerTask('remote:restart', function () {
    grunt.shipit.remote('cd deploy/current && forever restart server.js', this.async());
  });

  grunt.shipit.on('deploy', function() {
    grunt.task.run(['remote:setup']);
  });

  // deploy hooks
  grunt.shipit.on('updated', function () {
    grunt.task.run(['remote:install']);
  });

  grunt.shipit.on('published', function () {
    grunt.task.run(['remote:restart']);
  });

};
