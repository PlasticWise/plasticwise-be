'use strict';

const {
  upload
} = require('@google-cloud/storage/build/cjs/src/resumable-upload');
const {
  addPosts,
  getPosts,
  getPostsById,
  updatePost,
  deletePost
} = require('../controllers/posts.controller');

const postsPlugin = {
  name: 'app/posts',
  dependencies: ['prisma'],
  register: async function (server) {
    server.route([
      {
        method: 'POST',
        path: 'api/v1/posts',
        options: {
          payload: { output: 'stream', parse: true, multipart: true }
        },
        handler: addPosts,
        pre: [{ method: upload.single('file'), assign: 'file' }]
      }
    ]);

    server.route([
      {
        method: 'GET',
        path: 'api/v1/posts',
        handler: getPosts
      }
    ]);

    server.route([
      {
        method: 'GET',
        path: 'api/v1/posts/{id}',
        handler: getPostsById
      }
    ]);

    server.route([
      {
        method: 'PATCH',
        path: 'api/v1/posts/{id}',
        handler: updatePost
      }
    ]);

    server.route([
      {
        method: 'DELETE',
        path: 'api/v1/posts/{id}',
        handler: deletePost
      }
    ]);
  }
};

module.exports = postsPlugin;
