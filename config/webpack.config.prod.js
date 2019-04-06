const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin')
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const autoprefixer = require('autoprefixer')
const webpackConfig = require('./webpack.config.base')
const helpers = require('./helpers')
const DefinePlugin = require('webpack/lib/DefinePlugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// const PrerenderSpaPlugin = require('prerender-spa-plugin')
// const path = require("path");

const env = require('../environment/prod.env')

const extractSass = new ExtractTextPlugin({
  filename: 'css/[name].[contenthash].css',
  disable: process.env.NODE_ENV === 'development'
})

webpackConfig.module.rules = [...webpackConfig.module.rules,
  {
    test: /\.(scss|css)$/,
    use: extractSass.extract({
      use: [
        {
          loader: 'css-loader',
          options: {
            minimize: false,
            sourceMap: false,
            importLoaders: 2
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => [autoprefixer],
            sourceMap: false
          }
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: false
          }
        },
        {
          loader: 'sass-resources-loader',
          options: {
            // Provide path to the file with resources
            // resources: './path/to/resources.scss',
  
            // Or array of paths
            resources: ['./src/sass/variables.scss',  './src/sass/mixins.scss', './node_modules/bootstrap/scss/bootstrap.scss']
          },
        },
        
      ],
      // use style-loader in development
      fallback: 'style-loader'
    })
  },
  {
    test: /\.(jpg|png|gif)$/,
    loader: 'file-loader?name=assets/img/[name].[ext]'
  },
  {
    test: /\.(eot|svg|ttf|woff|woff2)$/,
    loader: 'file-loader?name=fonts/[name].[ext]'
  }
];

// ensure ts lint fails the build
webpackConfig.module.rules[0].options = {
  failOnHint: false
};

webpackConfig.plugins = [...webpackConfig.plugins,
  new CommonsChunkPlugin({
    name: 'vendor',
    minChunks: function (module) {
      return module.context && module.context.indexOf('node_modules') !== -1
    }
  }),
  new CommonsChunkPlugin({
    name: 'manifest',
    minChunks: Infinity
  }),
  extractSass,
  new OptimizeCssAssetsPlugin({
    cssProcessor: require('cssnano'),
    cssProcessorOptions: {
      discardUnused: false,
      discardComments: { removeAll: true }
    },
    canPrint: true
  }),
  new HtmlWebpackPlugin({
    inject: true,
    template: helpers.root('/src/index.html'),
    favicon: helpers.root('/src/favicon.ico'),
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true
    }
  }),
  new UglifyJsPlugin({
    include: /\.js$/,
    minimize: true
  }),

  new DefinePlugin({
    'process.env': env
  }),
  new FaviconsWebpackPlugin(helpers.root('/src/icon.png')),
  new CompressionPlugin({
    asset: '[path].gz[query]',
    algorithm: "gzip",
    test: /\.js$|\.css$/,

  }),
  /* new PrerenderSpaPlugin(
    // Path to compiled app
    path.join(__dirname, '../dist'),
    // List of endpoints you wish to prerender
    [ '/' ]
  ) */

]

module.exports = webpackConfig;
