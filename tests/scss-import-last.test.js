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
        "import a from './foo';" +
        "import './style.scss';"
      )
    },
    {
      code: (
        "import a from './foo';\n" +
        "import b from './bar';\n" +
        "import c from './baz';\n" +
        "export { hello } from './hello'\n" +
        "export * from './world'\n" +
        "\n" +
        "import './style.scss';"
      ),
    }
  ],
  invalid: [
    {
      code: (
        "import './bbb.scss';\n" +
        "import './ccc.scss';\n" +
        "import a from './foo';\n" +
        "import b from './bar';\n" +
        "import c from './baz';\n" +
        "import './aaa.scss';\n"
      ),
      output: (
        "import './ccc.scss';\n" +
        "import a from './foo';\n" +
        "import b from './bar';\n" +
        "import c from './baz';\n" +
        "\n" +
        "import './aaa.scss';\n" +
        "import './bbb.scss';\n"
      ),
      errors: [
        { message: 'SCSS import must be last: ./bbb.scss' },
        { message: 'SCSS import must be last: ./ccc.scss' },
      ],
    },
    {
      code: (
        "import './ccc.scss';\n" +
        "import a from './foo';\n" +
        "import b from './bar';\n" +
        "import c from './baz';\n" +
        "import './aaa.scss';\n" +
        "import './bbb.scss';\n"
      ),
      output: (
        "import a from './foo';\n" +
        "import b from './bar';\n" +
        "import c from './baz';\n" +
        "\n" +
        "import './aaa.scss';\n" +
        "import './bbb.scss';\n" +
        "import './ccc.scss';\n"
      ),
      errors: [
        { message: 'SCSS import must be last: ./ccc.scss' },
      ],
    },
    {
      code: (
        "import './aaa.scss';\n" +
        "import a from './foo';\n" +
        "import './bbb.scss';\n" +
        "import b from './bar';\n" +
        "import './ccc.scss';\n" +
        "import c from './baz';\n"
      ),
      output: (
        "import a from './foo';\n" +
        "import './bbb.scss';\n" +
        "import b from './bar';\n" +
        "import './ccc.scss';\n" +
        "import c from './baz';\n" +
        "\n" +
        "import './aaa.scss';\n"
      ),
      errors: [
        { message: 'SCSS import must be last: ./aaa.scss' },
        { message: 'SCSS import must be last: ./bbb.scss' },
        { message: 'SCSS import must be last: ./ccc.scss' }
      ],
    },
    {
      code: (
        "import './aaa.scss';\n" +
        "export {" +
          "one,\n" +
          "two,\n" +
          "three,\n" +
        "} from './foo';\n" +
        "export * from './foo';\n"
      ),
      output: (
        "export {" +
          "one,\n" +
          "two,\n" +
          "three,\n" +
        "} from './foo';\n" +
        "export * from './foo';\n" +
        "\n" +
        "import './aaa.scss';\n"
      ),
      errors: [
        { message: 'SCSS import must be last: ./aaa.scss' },
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
