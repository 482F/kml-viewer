module.exports = {
  publicPath:
    process.env.NODE_ENV === 'production'
      ? '/kml-viewer/' //任意
      : '/',
  outputDir: 'dist/latest',
  transpileDependencies: [
    'vuetify'
  ]
}
