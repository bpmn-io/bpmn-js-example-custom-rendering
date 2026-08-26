import bpmnIoPlugin from 'eslint-plugin-bpmn-io';

const files = {
  ignored: [
    'public'
  ],
  browser: [
    'app/**/*.js'
  ],
  build: [
    'webpack.config.js'
  ]
};

export default [
  {
    ignores: files.ignored
  },
  ...bpmnIoPlugin.configs.browser.map(config => ({
    ...config,
    files: files.browser
  })),
  ...bpmnIoPlugin.configs.node.map(config => ({
    ...config,
    files: files.build,
    languageOptions: {
      ...config.languageOptions,
      sourceType: 'commonjs'
    }
  }))
];
