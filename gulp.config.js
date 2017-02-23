module.exports = {
  // Paths
  paths: {
    sass:   '_assets/_sass',
    js:     '_assets/_js',
    css:    'css',
    script: 'js',
    dest:   '_site',
  },

  // Jekyll
  jekyll: {
    watch: [
      './**/*',
      '!./*',
      './_config*yml',
      '!./node_modules/**/*',
      '!./_assets/**/*',
      '!./_site/**/*'
    ],
    
    build: {
      development: ['--config=_config.yml','--future','--unpublished','--drafts'],
      production:  ['--config=_config.yml'],
      debug:       ['--config=_config.yml','--verbose','--profile','--future','--unpublished','--drafts'],
    }
  },

  // BrowserSync
  port: 4000,
  host: 'localhost',

  // List of files/dirs to remove with `clean`
  // To Do: Don't repeat path settings above
  clean: [
    './.jekyll-metadata',
    '_site',
    'css',
    'js'
  ]
}