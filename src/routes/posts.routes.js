const { addPosts } = require('../controllers/posts.controller');

const postsRoutes = [
  {
    method: 'GET',
    path: '/api/v1/posts/',
    handler: ''
  },
  {
    method: 'GET',
    path: '/api/v1/posts/:id',
    handler: ''
  },
  {
    method: 'POST',
    path: '/api/v1/posts/add',
    handler: addPosts
  }
];
