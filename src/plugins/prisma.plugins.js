'use strict';

const { PrismaClient } = require('@prisma/client');

const prismaPlugin = {
  name: 'prisma',
  register: async function (server) {
    const prisma = new PrismaClient();

    server.app.prisma = prisma;

    server.ext({
      type: 'onPostStop',
      method: async server => {
        server.app.prisma.$disconnect();
      }
    });
  }
};

module.exports = prismaPlugin;
