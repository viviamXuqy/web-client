const moment = require('moment');
const { injectBabelPlugin, paths } = require('react-app-rewired'); // eslint-disable-line
const rewireLess = require('react-app-rewire-less'); // eslint-disable-line
const FileManagerPlugin = require('filemanager-webpack-plugin'); // eslint-disable-line
const theme = require('./config/theme');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // eslint-disable-line

module.exports = function override(config, env) {
  let newConfig = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
  newConfig = rewireLess.withLoaderOptions({
    javascriptEnabled: true,
    modifyVars: theme,
  })(newConfig, env);

  if (process.env.NODE_ENV === 'production') {
    newConfig.plugins = (newConfig.plugins || []).concat([new FileManagerPlugin({
      onEnd: {
        mkdir: [
          './dist',
        ],
        archive: [
          { source: './build/**/*', destination: `./dist/build_${moment().format('YYYYMMDD')}.zip` },
        ],
        // delete: [
        //   './build',
        // ],
      },
    })]);
    newConfig.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
      }),
    );
  }

  return newConfig;
};
