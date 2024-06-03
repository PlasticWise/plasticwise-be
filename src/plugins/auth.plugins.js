const admin = require('../utils/firebase');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authPlugin = {
  name: 'auth',
  register: async function (server, options) {
    server.route([
      {
        method: 'POST',
        path: 'api/v1/register',
        handler: async (request, h) => {
          const { email, password, displayName } = request.payload;

          try {
            const userRecord = await admin.auth().createUser({
              email,
              password,
              displayName
            });
            await prisma.user.create({
              data: {
                id: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName
              }
            });
            return h.response({ message: 'User registered successfully' });
          } catch (error) {
            return Boom.badRequest(error.message);
          }
        }
      },
      {
        method: 'POST',
        path: '/api/v1/login',
        handler: async (request, h) => {
          const { idToken } = request.payload;
          try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const user = await admin.auth().getUser(decodedToken.uid);

            //cari atau buat user di database
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

            return h
              .response({ message: 'Login successful', user: dbUser })
              .code(200);
          } catch (error) {
            return Boom.unauthorized('Token tidak valid');
          }
        }
      }
    ]);
  }
};

module.exports = authPlugin;
