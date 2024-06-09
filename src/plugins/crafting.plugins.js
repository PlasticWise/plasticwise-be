'use strict';

const {
  addCrafting,
  getCrafting,
  getCraftingById,
  getCraftingByCategory
} = require('../controllers/crafting.controller');

const craftingPlugin = {
  name: 'app/crafting',
  dependencies: ['prisma'],
  register: async function (server) {
    server.route([
      {
        method: 'POST',
        path: '/api/v1/crafting',
        options: {
          payload: {
            maxBytes: 1048576 * 3, //3MB Limit
            output: 'stream',
            parse: true,
            allow: 'multipart/form-data',
            multipart: true
          }
        },
        handler: addCrafting
      }
    ]);

    server.route([
      {
        method: 'GET',
        path: '/api/v1/crafting',
        handler: getCrafting
      }
    ]);

    server.route([
      {
        method: 'GET',
        path: '/api/v1/crafting/{id}',
        handler: getCraftingById
      }
    ]);

    server.route([
      {
        method: 'GET',
        path: '/api/v1/crafting/categories/{categories}',
        handler: getCraftingByCategory
      }
    ]);
  }
};

module.exports = craftingPlugin;
