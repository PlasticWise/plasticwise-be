'use strict';

const {
  addPosts,
  getPosts,
  getPostsById,
  updatePost,
  deletePost
} = require('../controllers/posts.controller');
// const { uploadToGCS } = require('../utils/upload');
// const { upload } = require('../utils/upload');
// const { upload } = require('../utils/upload');

const postsPlugin = {
  name: 'app/posts',
  dependencies: ['prisma'],
  register: async function (server) {
    //TODO: allowing multipart formdata and multer to gcs
    server.route([
      {
        method: 'POST',
        path: '/api/v1/posts',
        handler: addPosts,
        options: {
          payload: {
            maxBytes: 1048576 * 3, //3MB Limit
            output: 'stream',
            parse: true,
            allow: 'multipart/form-data',
            multipart: true
          }
          // pre: [{ method: upload.single('file'), assign: 'file' }]
        }
      }
    ]);

    server.route([
      {
        method: 'GET',
        path: '/api/v1/posts',
        handler: getPosts
      }
    ]);

    server.route([
      {
        method: 'GET',
        path: '/api/v1/posts/{id}',
        handler: getPostsById
      }
    ]);

    //TODO: allowing multipart formdata and multer to gcs
    server.route([
      {
        method: 'PATCH',
        options: {
          payload: {
            output: 'stream',
            parse: true,
            allow: 'multipart/form-data'
          }
        },
        path: '/api/v1/posts/{id}',
        handler: updatePost
      }
    ]);

    server.route([
      {
        method: 'DELETE',
        path: '/api/v1/posts/{id}',
        handler: deletePost
      }
    ]);
  }
};

module.exports = postsPlugin;
