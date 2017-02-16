// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // 在块级作用域外访问块内定义的变量是否报错提示
    "block-scoped-var": 0,
    // if while function 后面的{必须与if在同一行，java风格。
    "brace-style": [2, "1tbs", { "allowSingleLine": true }],
    // 要求或禁止在注释前有空白 (space 或 tab)
    "spaced-comment": ["error", "always", {
      "line": {
        "markers": ["/"],
        "exceptions": ["-", "+"]
      },
      "block": {
        "markers": ["!"],
        "exceptions": ["*"],
        "balanced": true
      }
    }],
    // 强制使用一致的反勾号、双引号或单引号
    quotes: [1, "double", {"avoidEscape": true}],
    // 强制使用一致的缩进
    "indent": ["error", 2],
    // 强制在对象字面量的键和值之间使用一致的空格 (key-spacing)
    "key-spacing": ["error", { "beforeColon": false, "afterColon": true, "mode": "strict" }],
    // 强制分号前后有空格
    "semi-spacing": ["error", {"before": false, "after": true}],
    // 要求或禁止语句块之前的空格
    "space-before-blocks": ["error", "always"],
    // 要求或禁止函数圆括号之前有一个空格
    "space-before-function-paren": ["error", {
      "anonymous": "never",
      "named": "never",
      "asyncArrow": "ignore"
    }],
    // 强制在逗号周围使用空格
    "comma-spacing": ["error", { "before": false, "after": true }],
    // 要求或禁止块内填充
    "padded-blocks": ["error", { "blocks": "never" }],
    // 要求或禁止使用分号代替
    "semi": ["error", "never"],
    // 禁用不必要的分号
    "no-extra-semi": 1,
    // 禁用不必要的转义
    "no-useless-escape": "error",
    // 禁止使用 Object 构造函数
    "no-new-object": 1,
    // 禁止未使用过的变量
    "no-unused-vars": [1, { "vars": "all", "args": "none" }],
    // 不允许多个空行
    "no-multiple-empty-lines":["error", { "max": 5 }],
    // 禁止使用令人困惑的多行表达式
    "no-unexpected-multiline": "error",
    // 禁止在 return、throw、continue 和 break 语句后出现不可达代码 (no-unreachable)
    "no-unreachable": "error"
  }
}
