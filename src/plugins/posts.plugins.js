'use strict';

const {
  addPosts,
  getPosts,
  getPostsById,
  updatePost,
  deletePost
} = require('../controllers/posts.controller');
const { upload } = require('../utils/upload');

const postsPlugin = {
  name: 'app/posts',
  dependencies: ['prisma'],
  register: async function (server) {
    server.route([
      {
        method: 'POST',
        path: '/api/v1/posts',
        handler: addPosts
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
        method: 'PATCH',
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
