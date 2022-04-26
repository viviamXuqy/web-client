module.exports = {
  extends: [
    "react-app",
    "airbnb"
  ],
  plugins: ["react", "jsx-a11y", "import"],
  rules: {
    "function-paren-newline": [
      2,
      "consistent"
    ],
    "class-methods-use-this": [
      "error",
      {
        "exceptMethods": [
          "componentDidMount",
          "componentDidUpdate",
          "componentWillMount",
          "componentWillReceiveProps",
          "componentWillUnmount",
          "componentWillUpdate",
          "render",
          "shouldComponentUpdate"
        ]
      }
    ],
    "semi": [
      "warn",
      "always"
    ],
    "no-plusplus":"off",
    "arrow-parens": [
      "error",
      "as-needed"
    ],
    "no-unused-expressions": "warn",
    "no-underscore-dangle": "off",
    "react/jsx-uses-vars": "warn",
    "react/prefer-stateless-function": [
      "error",
      {
        "ignorePureComponents": true
      }
    ],
    "object-shorthand": "warn",
    "import/no-named-as-default": "off",
    "react/jsx-filename-extension": [
      "error",
      {
        "extensions": [
          ".jsx",
          ".js"
        ]
      }
    ],
    "no-debugger": process.env.NODE_ENV === 'production' ? 2 : 0,
    "react/jsx-uses-react": "error",
    "jsx-a11y/no-static-element-interactions": 0,
    "react/no-did-mount-set-state": "off",
    "react/forbid-prop-types": "off",
    "jsx-a11y/href-no-hash": "off",
    "jsx-a11y/anchor-is-valid": [
      "error",
      {
        "specialLink": [
          "hrefLeft",
          "hrefRight"
        ],
        "aspects": [
          "noHref",
          "invalidHref",
          "preferButton"
        ]
      }
    ],
    "no-empty-function": 2,
    "jsx-a11y/media-has-caption": 'off'
  },
  settings: {
    "import/resolver": {
      "node": {
        "paths": "./src"
      }
    }
  }
};