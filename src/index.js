const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const prisma = require('./plugins/prisma.plugins');
const posts = require('./plugins/posts.plugins');
const firebase = require('./plugins/firebase.plugins');
const tutorials = require('./plugins/tutorials.plugins');
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

  await server.register(Inert);

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => 'Hello, Hapi!'
  });

  await server.register([
    prisma,
    posts,
    tutorials,
    clientPlugin,
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
