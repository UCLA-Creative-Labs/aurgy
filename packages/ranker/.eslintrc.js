const baseConfig = require('../../.eslintrc.build');
baseConfig.env.browser = true;
baseConfig.extends.push('plugin:react/recommended');
baseConfig.parserOptions.project = __dirname + '/tsconfig.json';
baseConfig.plugins.push('react');
baseConfig.settings = { react: { version: 'detect' } };
baseConfig.rules['react/prop-types'] = 0;
module.exports = baseConfig;