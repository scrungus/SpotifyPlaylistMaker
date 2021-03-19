const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  app.use('/api',
  createProxyMiddleware({
     target: 'http://spotifyplaylistmaker_auth_1:8000/',
     changeOrigin: true, }));

  app.use('/notused',
  createProxyMiddleware({
    target: 'https://accounts.spotify.com/',
    changeOrigin: true, }));
};
