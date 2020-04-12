const ImageminPlugin = require('imagemin-webpack-plugin').default
const imageminMozjpeg = require('imagemin-mozjpeg')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = {
  transpileDependencies: [
    'vuetify',
    'browser-image-compression',
    'country-reverse-geocoding',
    'firebase',
    'lodash',
    'moment',
    'secure-ls',
    'sweetalert2',
    'uuid',
    'vue-cropper',
    'vue-firestore',
    'vue-headful',
    'vue-router',
    'vue-social-sharing',
    'vuefire',
  ],
  productionSourceMap: false,
  configureWebpack: {
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
              )[1]

              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace('@', '')}`
            },
          },
        },
      },
    },
    plugins: [
      new ImageminPlugin({
        disable: process.env.NODE_ENV !== 'production',
        plugins: [
          imageminMozjpeg({
            quality: 50,
            progressive: true,
          }),
        ],
      }),
      new FaviconsWebpackPlugin({
        logo: './src/assets/WikivapeiaLogoBlack.svg',
        outputPath: '/img/icons',
      }),
      // new CompressionPlugin({
      //   compressionOptions: {
      //     numiterations: 15,
      //   },
      //   algorithm(input, compressionOptions, callback) {
      //     return zopfli.gzip(input, compressionOptions, callback)
      //   },
      //   deleteOriginalAssets: true,
      //   exclude: 'index.html',
      // }),
    ],
  },
}
