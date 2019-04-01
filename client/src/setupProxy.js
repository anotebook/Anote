const proxy = require('http-proxy-middleware');

// eslint-disable-next-line func-names
module.exports = function(app) {
  if (process.env.NODE_ENV === 'development')
    app.use(proxy('/api', { target: 'http://localhost:5000' }));
};
