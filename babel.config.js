// babel.config.js
module.exports = {
  presets: [
    // Preset for compiling modern JavaScript to older versions for compatibility
    ["@babel/preset-env", { targets: { node: "current" } }],
    // Preset for compiling React JSX syntax
    ["@babel/preset-react", { runtime: "automatic" }] // 'automatic' for React 17+
  ],
  plugins: [
    // Add any necessary Babel plugins here.
    // If you had specific plugins in your package.json overrides that correspond to Babel plugins,
    // you might need to add them here, but the presets handle most common cases.
    // For example, if you encounter issues with class properties or optional chaining
    // from your overrides, you'd add:
    // ['@babel/plugin-proposal-class-properties', { loose: true }],
    // ['@babel/plugin-proposal-optional-chaining'],
    // ['@babel/plugin-proposal-nullish-coalescing-operator'],
    // ['@babel/plugin-proposal-private-methods'],
    // ['@babel/plugin-proposal-private-property-in-object']
  ]
};
