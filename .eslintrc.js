module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    semi: ['warning', 'always'], // 强制每句结尾使用分号
    'react/react-in-jsx-scope': 'off', // 关闭 JSX 中必须导入 React 的规则
    '@typescript-eslint/explicit-module-boundary-types': 'off' // 关闭显式模块边界类型的规则
  }
};
