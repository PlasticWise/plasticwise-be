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
            // const listUser = await admin.auth().listUsers();
            await prisma.user.create({
              data: {
                id: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord?.displayName
              }
            });
            return h.response({ message: 'User registered successfully' });
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
          // const { idToken } = request.payload;
          // try {
          //   const decodedToken = await admin.auth().veri;
          //   const user = await admin.auth().getUser(decodedToken.uid);

          //   //cari atau buat user di database
          //   const dbUser = await prisma.user.upsert({
          //     where: { id: user.uid },
          //     update: {
          //       email: user.email,
          //       displayName: user.displayName
          //     },
          //     create: {
          //       id: user.uid,
          //       email: user.email,
          //       displayName: user.displayName
          //     }
          //   });

          //   return h
          //     .response({ message: 'Login successful', user: dbUser })
          //     .code(200);
          // } catch (error) {
          //   return Boom.unauthorized('Token tidak valid');
          // }
        }
      }
    ]);
  }
};

module.exports = authPlugin;
