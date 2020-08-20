const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
  }
  collecting() {
    this.log('collecting');
  }
  creating() {
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('./package.json'),
      { title: 'Templating' }
    );
    this.fs.copyTpl(
      this.templatePath('lib/createElement.js'),
      this.destinationPath('lib/createElement.js')
    );
    this.fs.copyTpl(
      this.templatePath('lib/gesture.js'),
      this.destinationPath('lib/gesture.js')
    );
    this.fs.copyTpl(
      this.templatePath('lib/animation.js'),
      this.destinationPath('lib/animation.js')
    );
    this.fs.copyTpl(
      this.templatePath('main.js'),
      this.destinationPath('src/main.js')
    );
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('src/index.html')
    );
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('./webpack.config.js')
    );
    this.fs.copyTpl(
      this.templatePath('test/main.test.js'),
      this.destinationPath('test/main.test.js')
    );
    this.fs.copyTpl(
      this.templatePath('.babelrc'),
      this.destinationPath('./.babelrc')
    );
    this.fs.copyTpl(
      this.templatePath('.nycrc'),
      this.destinationPath('./.nycrc')
    );
    this.npmInstall(
      [
        'webpack',
        'webpack-cli@3.3.12',
        'html-webpack-plugin',
        'webpack-dev-server',
        'babel-loader',
        '@babel/core',
        '@babel/preset-env',
        '@babel/plugin-transform-react-jsx',
        '@babel/register',
        'mocha',
        'nyc',
        '@istanbuljs/nyc-config-babel',
        'babel-plugin-istanbul',
      ],
      {
        'save-dev': true,
      }
    );
    // this.fs.copyTpl(
    //   this.templatePath('index.html'),
    //   this.destinationPath('public/index.html'),
    //   { title: 'Templating with Yeoman' }
    // );
  }
};
