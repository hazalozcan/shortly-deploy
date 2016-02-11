module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options:{
        separator: ';',
      },
      built: {
        src: ['public/client/*.js'],
        dest: 'public/dist/built.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      my_target:{
        files: {
          'public/dist/built.min.js' : ['public/dist/built.js'],
          'public/dist/backbone.min.js' : ['public/lib/backbone.js'],
          'public/dist/handlebars.min.js' : ['public/lib/handlebars.js'],
          'public/dist/jquery.min.js' : ['public/lib/jquery.js'],
          'public/dist/underscore.min.js' : ['public/lib/underscore.js'],
        }
      }
    },

    eslint: { 
      
      target: ['app/*', 'lib/*']
    },

    cssmin: {
      target: {
        files: {
          'public/dist/style.min.css' : ['public/style.css']
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },
    clean: ['public/dist'],

    shell: {
      prodServer: { 
        command: "git push live master"
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');


  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
      cmd: 'grunt',
      grunt: true,
      args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [ 
    'clean', 'concat', 'uglify', 'cssmin', 'mochaTest'
  ]);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) { 
      // grunt.task.run(['shell:prodServer']);
      // add your production server task here
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', function (n) {
    if (grunt.option('prod')) { 
      grunt.task.run(['shell:prodServer']);
    } else {
      grunt.task.run(['build', 'upload'])
    }
  });


};
