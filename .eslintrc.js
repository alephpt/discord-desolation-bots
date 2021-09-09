module.exports = {
  "env": {
    "es6": true,
    "node": true
  },
  "parserOptions": {
    "sourceType": `module`,
    "ecmaVersion": 2020
  },
  // ignore certain files
  "ignorePatterns": [`docs/**/*.js`, `?.js`],
  "extends": `eslint:recommended`,
  "rules": {
    "quotes": [1, `backtick`],

    "indent": [`error`, 2],
    "no-trailing-spaces": [`error`, { "skipBlankLines": false }],
    "semi": [`error`, `always`],
    "no-undef": [`warn`],
    "no-unused-vars": [`warn`],
    "no-cond-assign": [`off`],

    "linebreak-style": [`error`, `unix`],
  }
};