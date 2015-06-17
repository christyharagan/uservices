var gulp= require('gulp')
var dts = require('dts-generator');

gulp.task('default', function(){
  dts  .generate({
    name: 'uservices',
    baseDir: './lib',
    excludes: ['./typings/node/node.d.ts', './typings/es6/es6.d.ts'],
    files: [ './index.ts' ],
    out: './uservices.d.ts',
    main: 'index'
  });
})
