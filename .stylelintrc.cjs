module.exports = {
  extends: 'stylelint-config-standard-scss',

  rules: {
    // 'selector-class-pattern': null,
    'selector-class-pattern': [
      '^[a-z0-9]+(?:-[a-z0-9]+)*(?:__[a-z0-9]+(?:-[a-z0-9]+)*)?(?:_[a-z0-9]+(?:-[a-z0-9]+)*)?$',
      {
        message: 'Expected class selector to be written in classic BEM style (e.g. block__element_modifier)',
      },
    ],
    'scss/percent-placeholder-pattern': [
      '^[a-z0-9]+(?:-[a-z0-9]+)*(?:__[a-z0-9]+(?:-[a-z0-9]+)*)?(?:_[a-z0-9]+(?:-[a-z0-9]+)*)?$',
      {
        message: 'Expected placeholder selector to be written in classic BEM style (e.g. %block__element_modifier)',
      },
    ],
  },
}
