const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/reservations',
    createProxyMiddleware({
      target: 'http://localhost:4000',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    })
  );
};

