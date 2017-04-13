var appRoot = 'src/';
var outputRoot = 'dist/';

module.exports = {
  root: appRoot,
  source: appRoot + '**/*.ts',
  data: appRoot + '**/*.json',
  html: appRoot + '**/*.html',
  styles: appRoot + '**/*.css',
  content: appRoot + '**/*.png',
  output: outputRoot,
  doc: './doc',
  e2eSpecsSrc: 'test/e2e/src/*.js',
  e2eSpecsDist: 'test/e2e/dist/'
};