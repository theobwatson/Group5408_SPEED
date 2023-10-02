const gulp = require('gulp');
const { exec } = require('child_process');

gulp.task('test', (done) => {
  exec('npm test', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    done(err);
  });
});

gulp.task('default', gulp.series('test'));
