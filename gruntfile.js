module.exports = function(grunt) {

  "use strict";
  
  require("jit-grunt")(grunt);

  grunt.initConfig({
    
    connect : {
      options : {
        port : 3001,
        hostname : "*",
        base : "build"
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
    
    babel: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          "build/main.js": "src/javascript/main.js"
        }
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
          cwd: "src/jade/",
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
          {expand: true, cwd: "images/", src: ["**"], dest: "build/images/"}
        ]
      },
      fonts : {
        files : [
          {expand: true, cwd: "fonts/", src: ["**"], dest: "build/fonts/"}
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
      markup : {
        files : ["src/jade/**"],
        tasks : ["jade"]
      },
      images : {
        files : ["src/images/**"],
        tasks : ["copy:images"]
      },
      fonts : {
        files : ["src/fonts/**"],
        tasks : ["copy:fonts"]
      },
      stylesheets : {
        files : ["src/stylus/**"],
        tasks : ["stylus"]
      },
      scripts : {
        files : ["src/js/**", "config/*.json"],
        tasks : ["babel"]
      }
    }

  });
  
  grunt.registerTask("test", ["karma"]);
  grunt.registerTask("document", ["clean"], ["jsdoc"]);
  grunt.registerTask("default", ["connect", "copy:images", "copy:fonts", "stylus", "babel", "watch"]);
  grunt.registerTask("make", ["copy:images", "copy:fonts", "stylus", "csso", "babel", "uglify", "watch"]);

};