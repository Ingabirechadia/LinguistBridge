// commitlint — enforce Conventional Commits on every git commit message
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allow longer subject lines for descriptive commits
    'header-max-length': [2, 'always', 120],
  },
};
