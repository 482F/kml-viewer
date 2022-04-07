const path = require('path')

module.exports = {
  publicPath:
    process.env.NODE_ENV === 'production'
      ? '/kml-viewer/' //任意
      : '/',
  outputDir: 'dist/latest',
  transpileDependencies: ['vuetify'],
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src'),
        '@atoms': path.join(__dirname, 'src/components/atoms'),
      },
    },
  },
}
