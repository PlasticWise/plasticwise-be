'use strict';

const usersPlugin = {
  name: 'app/users',
  dependencies: ['prisma'],
  register: async function (server) {
    server.route([
      {
        method: 'POST',
        path: '/user'
        // handler: createUserHandler
      }
    ]);
  }
};

module.exports = usersPlugin;
