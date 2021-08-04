module.exports = {
  'plugins': [
    [
      '@babel/plugin-transform-runtime',
      {
        'corejs': false,
        'regenerator': false
      }
    ]
  ],
  'sourceType': 'unambiguous',
  'presets': [
    [
      '@babel/preset-env',
      {
        'modules': false,
        'shippedProposals': true,
        'useBuiltIns': 'usage',
        'corejs': {
          'version': '3.10',
          'proposals': true
        },
        'targets': {}
      }
    ]
  ]
};
