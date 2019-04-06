const helpers = require('./helpers'),
  webpackConfig = require('./webpack.config.base'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  DefinePlugin = require('webpack/lib/DefinePlugin'),
  env = require('../environment/dev.env');

webpackConfig.module.rules = [...webpackConfig.module.rules,
  {
    test: /\.(scss|css)$/,
    use: [{
        loader: 'style-loader'
      },
      {
        loader: 'css-loader'
      },
      {
        loader: 'sass-loader'
      },
      {
        loader: 'sass-resources-loader',
        options: {
          // Provide path to the file with resources
          // resources: './path/to/resources.scss',

          // Or array of paths
          resources: ['./src/sass/variables.scss', './src/sass/mixins.scss', './node_modules/bootstrap/scss/bootstrap.scss']
        },
      }
    ]
  },
  {
    test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)$/,
    loader: 'file-loader',
    query: {
        outputPath: '/src/',
        publicPath: 'http://localhost:8080/',
        emitFile: true
    }
  }
];


webpackConfig.plugins = [...webpackConfig.plugins,
  new HtmlWebpackPlugin({
    inject: true,
    template: helpers.root('/src/index.dev.html'),
    favicon: helpers.root('/src/favicon.ico')
  }),
  new DefinePlugin({
    'process.env': env
  })
];

webpackConfig.devServer = {
  port: 8080,
  host: 'localhost',
  historyApiFallback: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  contentBase: './src',
  open: true
};

module.exports = webpackConfig;
