module.exports = function(grunt) {

  "use strict";
  
  require("jit-grunt")(grunt);

  grunt.initConfig({
    
    concurrent: {
      dev : ['webpack:dev', 'watch'],
      options : {
        logConcurrentOutput : true
      }
    },
    
    connect : {
      dev : {
        options : {
          port : 8000,
          hostname : "*",
          base : "build"
        }
      }
    },
    
    karma : {
      build : {
        configFile : "karma.conf.js"
      }
    },
    
    clean : {
      documentation : ["documentation"]
    },
    
    webpack : {
      options : {
        module: {
          loaders: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              loader: 'babel-loader'
            },
            {
              test: /\.json$/,
              exclude: /node_modules/,
              loader: 'json-loader'
            }
          ]
        }
      },
      build : {
        entry: "./javascript/main.js",
        output: {
          path: "build/",
          filename: "main.js",
        },
        stats: {
          colors: true,
          modules: false,
          reasons: true
        },
        progress: false,
        watch: false,
        keepalive: false
      }
    },

    uglify : {
      options : {
        mangle : true,
        compress : true,
        screwIE8 : true,
        report : "gzip"
      },
      build : {
        files : {
          "build/main.min.js" : ["build/main.js"]
        }
      }
    },
    
    copy : {
      build : {
        files : [
          {expand: true, cwd: "src/images/", src: ["**"], dest: "build/images/"},
          {expand: true, cwd: "src/fonts/", src: ["**"], dest: "build/fonts/"}
        ]
      }
    },
    
    jsdoc : {
      build : {
        src: ["src/javascript/*.js", "src/javascript/**/*.js", "README.md"], 
        options: {
          destination: "documentation"
        }
      }
    },
    
    jade: {
      build: {
        options: {
          client: false,
          pretty: false
        },
        files: [{
          cwd: "jade/",
          src: "*.jade",
          dest: "build",
          expand: true,
          ext: ".html"
        }]
      }
    },
    
    stylus: {
      build: {
        options: {
          compress : false,
          use: [
            function() {
              return require("autoprefixer-stylus")({
                browsers : ["last 2 versions", "ie 9"]
              });
            }
          ]
        },
        files: {
          "build/main.css": "stylus/main.styl"
        }
      }
    },
    
    csso: {
      build: {
        options: {
          report: "gzip"
        },
        files: {
          "build/main.min.css": ["build/main.css"]
        }
      }
    },
    
    copy : {
      images : {
        files : [
          {expand: true, cwd: "assets/images/", src: ["**"], dest: "build/images/"}
        ]
      },
      fonts : {
        files : [
          {expand: true, cwd: "assets/fonts/", src: ["**"], dest: "build/fonts/"}
        ]
      }
    },
    
    karma : {
      run : {
        configFile : 'karma.conf.js'
      }
    },

    watch: {
      options : {
        livereload : {
          port : 3857
        },
        files: ["build/**"],
      },
      jade : {
        files : ["jade/**"],
        tasks : ["jade"]
      },
      images : {
        files : ["assets/images/**"],
        tasks : ["copy:images"]
      },
      fonts : {
        files : ["assets/fonts/**"],
        tasks : ["copy:fonts"]
      },
      stylesheets : {
        files : ["stylus/**"],
        tasks : ["stylus"]
      },
      scripts : {
        files : ["javascript/**"],
        tasks : ["webpack:build"]
      }
    }

  });
  
  grunt.registerTask("test", ["karma"]);
  grunt.registerTask("document", ["clean"], ["jsdoc"]);
  grunt.registerTask("default", ["connect:dev", "copy:images", "copy:fonts", "jade", "stylus", "webpack", "watch"]);
  grunt.registerTask("make", ["copy:images", "copy:fonts", "jade", "stylus", "csso", "webpack:build", "uglify"]);

};