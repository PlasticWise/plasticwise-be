const Boom = require('@hapi/boom');
const admin = require('../utils/firebase');
const { prisma } = require('../utils/db');

const validateUser = async (request, h) => {
  const token = request.headers.authorization?.split(' ')[1];
  if (!token) {
    throw Boom.unauthorized('No token provided');
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const user = await admin.auth().getUser(decodedToken.uid);

    // cari atau buat pengguna di database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.uid }
    });

    request.user = dbUser;
    return h.continue;
  } catch (error) {
    throw Boom.unauthorized(error);
  }
};

const firebasePlugin = {
  name: 'app/firebase',
  register: async function (server, options) {
    server.ext({
      type: 'onPreAuth',
      method: async (request, h) => {
        const routeConfig = request.route.settings.plugins.firebasePlugin;

        // Skip authentication for routes that have `authRequired` set to `false`
        if (routeConfig && routeConfig.authRequired === false) {
          return h.continue;
        }

        return validateUser(request, h);
      }
    });
  }
};

module.exports = firebasePlugin;
