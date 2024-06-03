'use strict';

const {
  upload
} = require('@google-cloud/storage/build/cjs/src/resumable-upload');
const {
  addCrafting,
  getCrafting,
  getCraftingById,
  updateTutorial,
  deleteTutorial
} = require('../controllers/crafting.controller');

const craftingPlugin = {
  name: 'app/crafting',
  dependencies: ['prisma'],
  register: async function (server) {
    // server.route([
    //   {
    //     method: 'POST',
    //     path: 'api/v1/crafting',
    //     options: {
    //       payload: { output: 'stream', parse: true, multipart: true }
    //     },
    //     handler: addCrafting,
    //     pre: [{ method: upload.single('file'), assign: 'file' }]
    //   }
    // ]);

    server.route([
      {
        method: 'GET',
        path: 'api/v1/crafting',
        handler: getCrafting
      }
    ]);

    server.route([
      {
        method: 'GET',
        path: 'api/v1/crafting/{id}',
        handler: getCraftingById
      }
    ]);

    // server.route([
    //   {
    //     method: 'PATCH',
    //     path: 'api/v1/crafting/{id}',
    //     handler: updateTutorial
    //   }
    // ]);

    // server.route([
    //   {
    //     method: 'DELETE',
    //     path: 'api/v1/crafting/{id}',
    //     handler: deleteTutorial
    //   }
    // ]);
  }
};

module.exports = craftingPlugin;
