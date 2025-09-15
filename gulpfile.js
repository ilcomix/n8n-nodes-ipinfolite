const { src, dest, series } = require('gulp');
const { exec } = require('child_process');

function buildIcons() {
  return src('nodes/**/*.{png,svg}')
    .pipe(dest('dist/'));
}

function buildTypeScript() {
  return new Promise((resolve, reject) => {
    exec('npx tsc -p tsconfig.json', (error, stdout, stderr) => {
      if (error) {
        console.error('TypeScript compilation error:', error);
        reject(error);
      } else {
        console.log('TypeScript compilation successful');
        resolve();
      }
    });
  });
}

exports['build:icons'] = buildIcons;
exports['build:ts'] = buildTypeScript;
exports['build'] = series(buildTypeScript, buildIcons);
