const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const prismaPlugin = require('./plugins/prisma.plugins');
const posts = require('./plugins/posts.plugins');
const loadModel = require('../src/services/loadModel');
const InputError = require('./exceptions/InputError');
const firebase = require('./plugins/firebase.plugins');
const craftings = require('./plugins/crafting.plugins');
const auth = require('./plugins/auth.plugins');
const detectionPlugin = require('./plugins/detection.plugins');
const clientPlugin = require('./plugins/client.plugins');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  });

  const model = await loadModel();
  server.app.model = model;

  server.ext('onPreResponse', function (request, h) {
    const response = request.response;

    if (response instanceof InputError) {
      const newResponse = h.response({
        status: 'fail',
        message: `${response.message} Silakan gunakan foto lain.`
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    if (response.isBoom) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message
      });
      newResponse.code(response.output.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.register(Inert);

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => 'Hello, Hapi!'
  });

  await server.register([
    prismaPlugin,
    posts,
    craftings,
    clientPlugin,
    detectionPlugin,
    firebase,
    auth
  ]);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
