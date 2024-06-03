const Boom = require('@hapi/boom');
const admin = require('../utils/firebase');
const prisma = require('../utils/db');

const validateUser = async (request, h) => {
  const token = request.headers.authorization?.split(' ')[1];
  if (!token) {
    throw Boom.unauthorized('No token provided');
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const user = await admin.auth().getUser(decodedToken.uid);

    //cari atau buat pengguna di database
    const dbUser = await prisma.user.upsert({
      where: { id: user.uid },
      update: {
        email: user.email,
        displayName: user.displayName
      },
      create: {
        id: user.uid,
        email: user.email,
        displayName: user.displayName
      }
    });

    request.user = dbUser;
    return h.continue;
  } catch (error) {
    throw Boom.unauthorized('Invalid token');
  }
};

const firebasePlugin = {
  name: 'app/firebase',
  register: async function (server, options) {
    server.auth.scheme('firebase', () => ({ authenticate: validateUser }));
    server.auth.strategy('default', 'firebase');
    server.auth.default('default');
  }
};

module.exports = firebasePlugin;
