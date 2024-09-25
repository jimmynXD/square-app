const path = require('path');

const buildEslintCommand = (filenames) =>
  `cd frontend && next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`;

const buildPrettierCommand = (filenames) =>
  `prettier --write ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' ')}`;

const buildVitestCommand = (filenames) =>
  `cd backend && vitest run --passWithNoTests ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' ')}`;

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand, buildPrettierCommand],
  'backend/**/*.{js,ts}': [buildVitestCommand],
};
