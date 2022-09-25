"use strict";

const { RuleTester } = require('eslint');
const scssImportLastRule = require('../rules/scss-import-last');

const fixtures = {
  valid: [
    {
      code: ''
    },
    {
      code: "import a from './foo';"
    },
    {
      code: (
        "import a from './foo';\n" +
        "import './style.scss';"
      )
    },
    {
      code: (
        "import a from './a';\n" +
        "import b from './b';\n" +
        "import c from './c';\n" +
        "\n" +
        "import './style.scss';"
      ),
    }
  ],
  invalid: [
    {
      code: (
        "import './a.scss';\n" +
        "import a from './a';\n" +
        "import './b.scss';\n" +
        "import { b } from './b';\n" +
        "import './c.scss';\n" +
        "import c from './c';"
      ),
      output: (
        "import a from './a';\n" +
        "import './b.scss';\n" +
        "import { b } from './b';\n" +
        "import './c.scss';\n" +
        "import c from './c';\n" +
        "\n" +
        "import './a.scss';"
      ),
      errors: [
        { message: 'SCSS import must be last: ./a.scss' },
        { message: 'SCSS import must be last: ./b.scss' },
        { message: 'SCSS import must be last: ./c.scss' }
      ],
    },
    {
      code: (
        "import './b.scss';\n" +
        "import './c.scss';\n" +
        "import a from './a';\n" +
        "import b from './b';\n" +
        "import c from './c';\n" +
        "import './a.scss';"
      ),
      output: (
        "import './c.scss';\n" +
        "import a from './a';\n" +
        "import b from './b';\n" +
        "import c from './c';\n" +
        "\n" +
        "import './a.scss';\n" +
        "import './b.scss';"
      ),
      errors: [
        { message: 'SCSS import must be last: ./b.scss' },
        { message: 'SCSS import must be last: ./c.scss' },
      ],
    },
    {
      code: (
        "import './c.scss';\n" +
        "import a from './a';\n" +
        "import { b } from './b';\n" +
        "import c from './c';\n" +
        "import './a.scss';\n" +
        "import './b.scss';"
      ),
      output: (
        "import a from './a';\n" +
        "import { b } from './b';\n" +
        "import c from './c';\n" +
        "\n" +
        "import './a.scss';\n" +
        "import './b.scss';\n" +
        "import './c.scss';"
      ),
      errors: [
        { message: 'SCSS import must be last: ./c.scss' },
      ],
    },
    {
      code: (
        "import {\n" +
          "a,\n" +
          "b,\n" +
          "c\n" +
        "} from './abc';\n" +
        "import './a.scss';\n" +
        "import * as foo from './foo';"
      ),
      output: (
        "import {\n" +
          "a,\n" +
          "b,\n" +
          "c\n" +
        "} from './abc';\n" +
        "import * as foo from './foo';\n" +
        "\n" +
        "import './a.scss';"
      ),
      errors: [
        { message: 'SCSS import must be last: ./a.scss' },
      ],
    },
    {
      code: (
        "import './a.scss';\n" +
        "import a from './a';\n" +
        "export { b } from './b';"
      ),
      output: (
        "import a from './a';\n" +
        "\n" +
        "import './a.scss';\n" +
        "export { b } from './b';"
      ),
      errors: [
        { message: 'SCSS import must be last: ./a.scss' }
      ],
    },
    {
      code: (
        "import './a.scss';\n" +
        "export { b } from './b';\n" +
        "import a from './a';"
      ),
      output: (
        "import './a.scss';\n" +
        "export { b } from './b';\n" +
        "import a from './a';"
      ),
      errors: [
        { message: 'SCSS import must be last: ./a.scss' }
      ],
    },
  ]
}

RuleTester.setDefaultConfig({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
  }
});

const ruleTester = new RuleTester();
ruleTester.run('scss-import-last', scssImportLastRule, fixtures);
