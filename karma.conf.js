'use strict';

var path = require('path');

module.exports = function(config) {
  config.set({
    
    browsers : ['PhantomJS'],
    
    frameworks : ['jasmine'],
    
    files : ['test/**/*.js'],
    
    preprocessors : {
      'test/**/*.js' : ['webpack']
    },
    
    reporters : ['progress', 'html', 'coverage'],
    
    coverageReporter : {
      type : 'html',
      dir : 'reports/coverage/'
    },
    
    htmlReporter : {
      outputDir : 'reports/test/',
      templatePath : null,
      focusOnFailures : true,
      namedFiles : false
    },
    
    webpack : {
      module : {
        preLoaders : [
          {
            test : /(\.js)$/,
            exclude : /(test|node_modules)\//,
            loader : 'isparta-instrumenter-loader'
          },
          {
            test: /\.json$/,
            exclude: /(node_modules)\//,
            loader: 'json-loader'
          }
        ]
      }
    },
    
    webpackMiddleware : {
      noInfo : true
    }
    
  });
};