'use strict';

const {
  addPosts,
  getPosts,
  getPostsById,
  updatePost,
  deletePost,
  getPostByCategory
} = require('../controllers/posts.controller');

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
    server.route([
      {
        method: 'GET',
        path: '/api/v1/{categories}/posts',
        handler: getPostByCategory
      }
    ]);

    //TODO: allowing multipart formdata and multer to gcs
    server.route([
      {
        method: 'PATCH',
        options: {
          payload: {
            maxBytes: 1048576 * 3, //3MB Limit
            output: 'stream',
            parse: true,
            allow: 'multipart/form-data',
            multipart: true
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
