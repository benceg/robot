'use strict';

var path = require('path');

module.exports = function(config) {
  config.set({
    
    browsers : ['PhantomJS'],
    
    frameworks : ['jasmine'],
    
    files : ['test/**/*.js'],
    
    exclude : ['node_modules'],
    
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
            test: /\.js$/,
            include: path.resolve('test/'),
            loader: 'babel'
          },
          {
            test : /\.js$/,
            include : path.resolve('javascript/'),
            loader : 'isparta'
          },
          {
            test: /\.txt$/,
            exclude: /(node_modules)\//,
            loader: 'raw'
          },
          {
            test: /\.json$/,
            exclude: /(node_modules)\//,
            loader: 'json'
          }
        ]
      }
    },
    
    webpackMiddleware : {
      noInfo : true
    }
    
  });
};