export default {
  extends: ['stylelint-config-standard-scss'],
  ignoreFiles: [
    'dist/**',
    'coverage/**',
    'node_modules/**',
    // Emitted by scripts/generate-material-symbols-font.ts. Lint the generator, not
    // its output: edits here are overwritten on the next run.
    'src/styles/_material-symbols.scss',
  ],
  // Every stylesheet's custom properties, so rules that check custom property usage also know the
  // ones a file uses without declaring them (global tokens, or a parent component's): `color:
  // --primary-color` (no `var()`) is dropped by the browser without a word, and only
  // `custom-property-no-missing-var-function` catches it.
  referenceFiles: [{ files: ['src/**/*.scss'], customSyntax: 'postcss-scss' }],
  // Every disable comment must say why, still be needed, and name a rule that exists: a rule
  // removed or renamed in a major upgrade would otherwise leave its disables behind silently.
  reportDescriptionlessDisables: true,
  reportInvalidScopeDisables: true,
  reportNeedlessDisables: true,
  rules: {
    'at-rule-empty-line-before': null,
    'custom-property-pattern': null,
    'alpha-value-notation': null,
    'color-function-alias-notation': null,
    'color-function-notation': null,
    'declaration-empty-line-before': null,
    'declaration-block-no-redundant-longhand-properties': null,
    'font-family-name-quotes': null,
    'media-feature-range-notation': null,
    'property-no-vendor-prefix': null,
    'rule-empty-line-before': null,
    'scss/double-slash-comment-whitespace-inside': null,
    'shorthand-property-no-redundant-values': null,
    'no-empty-source': null,
  },
};
