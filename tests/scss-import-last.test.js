"use strict";

const { RuleTester } = require('eslint');
const scssImportLastRule = require('../rules/scss-import-last');

const fixtures = {
  valid: [
    {
      code: ''
    },
    {
      code: "import a from './foo.js';"
    },
    {
      code: (
        "import a from './foo.js';" +
        "import './style.scss';"
      )
    },
    {
      code: (
        "import a from './foo.js';\n" +
        "import b from './bar.js';\n" +
        "import c from './baz.js';\n" +
        "export { hello } from './hello.js'\n" +
        "export * from './world.js'\n" +
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
        "import a from './foo.js';\n" +
        "import b from './bar.js';\n" +
        "import c from './baz.js';\n" +
        "import './aaa.scss';\n"
      ),
      output: (
        "import './ccc.scss';\n" +
        "import a from './foo.js';\n" +
        "import b from './bar.js';\n" +
        "import c from './baz.js';\n" +
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
        "import a from './foo.js';\n" +
        "import b from './bar.js';\n" +
        "import c from './baz.js';\n" +
        "import './aaa.scss';\n" +
        "import './bbb.scss';\n"
      ),
      output: (
        "import a from './foo.js';\n" +
        "import b from './bar.js';\n" +
        "import c from './baz.js';\n" +
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
        "import a from './foo.js';\n" +
        "import './bbb.scss';\n" +
        "import b from './bar.js';\n" +
        "import './ccc.scss';\n" +
        "import c from './baz.js';\n"
      ),
      output: (
        "import a from './foo.js';\n" +
        "import './bbb.scss';\n" +
        "import b from './bar.js';\n" +
        "import './ccc.scss';\n" +
        "import c from './baz.js';\n" +
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
        "} from './foo.js';\n" +
        "export * from './foo.js';\n"
      ),
      output: (
        "export {" +
          "one,\n" +
          "two,\n" +
          "three,\n" +
        "} from './foo.js';\n" +
        "export * from './foo.js';\n" +
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
