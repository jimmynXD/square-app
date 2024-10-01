const path = require('path');

const buildPrettierCommand = (filenames) =>
  `prettier --write ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' ')}`;

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildPrettierCommand],
};
