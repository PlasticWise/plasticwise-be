const { postDetectHandler } = require('../controllers/detection.controller');

const detectionPlugin = {
  name: 'detection',
  reguister: async function (server, options) {
    server.route([
      {
        method: 'POST',
        path: '/api/v1/detection',
        handler: postDetectHandler,
        options: {
          payload: {
            allow: 'multipart/form-data',
            multipart: true,
            maxBytes: 1000000
          }
        }
      }
    ]);
  }
};

module.exports = detectionPlugin;
