var gulp= require('gulp')
var dts = require('dts-generator');

gulp.task('default', function(){
  dts  .generate({
    name: 'uservices',
    baseDir: './lib',
    files: [ './index.ts' ],
    out: './uservices.d.ts',
    main: 'index'
  });
})
