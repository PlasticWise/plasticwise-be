'use strict';

const {
  upload
} = require('@google-cloud/storage/build/cjs/src/resumable-upload');
const {
  addTutorials,
  getTutorials,
  getTutorialsById,
  updateTutorial,
  deleteTutorial
} = require('../controllers/tutorials.controller');

const tutorialsPlugin = {
  name: 'app/tutorials',
  dependencies: ['prisma'],
  register: async function (server) {
    server.route([
      {
        method: 'POST',
        path: 'api/v1/tutorials',
        options: {
          payload: { output: 'stream', parse: true, multipart: true }
        },
        handler: addTutorials,
        pre: [{ method: upload.single('file'), assign: 'file' }]
      }
    ]);

    server.route([
      {
        method: 'GET',
        path: 'api/v1/tutorials',
        handler: getTutorials
      }
    ]);

    server.route([
      {
        method: 'GET',
        path: 'api/v1/tutorials/{id}',
        handler: getTutorialsById
      }
    ]);

    server.route([
      {
        method: 'PATCH',
        path: 'api/v1/tutorials/{id}',
        handler: updateTutorial
      }
    ]);

    server.route([
      {
        method: 'DELETE',
        path: 'api/v1/tutorials/{id}',
        handler: deleteTutorial
      }
    ]);
  }
};

module.exports = tutorialsPlugin;
