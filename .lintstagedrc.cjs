// lint-staged — runs ESLint + Prettier only on staged files
module.exports = {
  'backend/src/**/*.ts': ['eslint --fix --max-warnings=0', 'prettier --write'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
};
