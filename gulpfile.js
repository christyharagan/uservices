var gulp= require('gulp')
var dts = require('dts-generator');

gulp.task('default', function(){
  dts  .generate({
    name: 'uservices',
    baseDir: './module',
    excludes: ['./typings/node/node.d.ts', './typings/typescript/lib.es6.d.ts'],
    files: [ './index.ts' ],
    out: './uservices.d.ts'
  });
})
