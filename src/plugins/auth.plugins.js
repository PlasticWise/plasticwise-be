const admin = require('../utils/firebase');
const Boom = require('@hapi/boom');
const { prisma } = require('../utils/db');

const authPlugin = {
  name: 'auth',
  dependencies: ['prisma'],
  register: async function (server, options) {
    server.route([
      {
        method: 'POST',
        options: {
          plugins: {
            firebasePlugin: {
              authRequired: false // No authentication required for the register route
            }
          },
          payload: {
            maxBytes: 1048576 * 3, //3MB Limit
            output: 'stream',
            parse: true,
            allow: 'multipart/form-data',
            multipart: true
          }
        },
        path: '/api/v1/register',
        handler: async (request, h) => {
          const { email, password, displayName } = request.payload;

          try {
            const userRecord = await admin.auth().createUser({
              email,
              password,
              displayName
            });

            const data = await prisma.user.create({
              data: {
                id: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord?.displayName
              }
            });
            return h.response({
              message: 'User registered successfully',
              data
            });
          } catch (error) {
            return Boom.badRequest(error.message);
          }
        }
      },
      {
        method: 'GET',
        path: '/api/v1/generateToken',
        handler: async (request, h) => {
          const token = await admin.auth().createCustomToken(uid); //change uid
          console.log(token);
          return h.response({ token });
        }
      }
    ]);
  }
};

module.exports = authPlugin;
