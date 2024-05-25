module.exports = {
  // Lint & Prettier JS files
  '**/*.(js)': filenames => [
    `npx eslint ${filenames.join(' ')}`,
    `npx prettier --write ${filenames.join(' ')}`
  ],

  // Prettier only Markdown and JSON files
  '**/*.(md|json)': filenames => `npx prettier --write ${filenames.join(' ')}`
};
