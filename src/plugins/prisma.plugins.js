'use strict';

const { PrismaClient } = require('@prisma/client');
const { prisma } = require('../utils/db');

const prismaPlugin = {
  name: 'prisma',
  register: async function (server) {
    server.app.prisma = prisma;

    await prisma.$connect();

    server.ext({
      type: 'onPostStop',
      method: async server => {
        server.app.prisma.$disconnect();
      }
    });
  }
};

module.exports = prismaPlugin;
