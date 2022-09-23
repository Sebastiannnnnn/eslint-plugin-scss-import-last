# eslint-plugin-scss-import-last

Rule to sort scss imports, so they're the last ones with one empty line before them. Any other empty lines between imports will be deleted.

## Usage

```
npm i --save-dev eslint-plugin-scss-import-last
```
or
```
yarn add --dev eslint-plugin-scss-import-last
```

.eslintrc.js
```
{
  plugins: [
    'scss-import-last'
  ],
  rules: {
    'scss-import-last/scss-import-last': 'error',
  }
}
```
