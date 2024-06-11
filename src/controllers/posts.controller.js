// const { uploadToGCS } = require('../utils/upload');
const { prisma } = require('../utils/db');
const path = require('path');
const { uploadToGCS } = require('../utils/upload');

const addPosts = async (request, h) => {
  try {
    const { title, body, categories, type, file } = request.payload;
    const authorId = request.user.id;

    //validating title and author
    const titleCheck = request.payload.hasOwnProperty('title');
    const authorCheck = request.payload.hasOwnProperty('authorId');

    if (!titleCheck && authorCheck !== null) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan postingan'
      });
      response.code(400);
      return response;
    }

    if (!file) {
      return h
        .response({ status: 'fail', message: 'Image is required' })
        .code(500);
    }

    // Read the file stream into a buffer
    const fileBuffer = await new Promise((resolve, reject) => {
      const chunks = [];
      file.on('data', chunk => {
        chunks.push(chunk);
      });
      file.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      file.on('error', err => {
        reject(err);
      });
    });

    // Attach the buffer to the file object
    file.buffer = fileBuffer;

    imageUrl = await uploadToGCS(file);

    const post = await prisma.post.create({
      data: {
        title: title,
        authorId: authorId,
        imageUrl: imageUrl,
        body: body,
        categories: categories,
        type: type
      }
    });
    return post;
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message
    });
    response.code(500);
    return response;
  }
};

const getPosts = async (request, h) => {
  try {
    const posts = await prisma.post.findMany();
    return posts;
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message
    });
    response.code(500);
    return response;
  }
};

const getPostsById = async (request, h) => {
  try {
    const { id } = request.params;

    const post = await prisma.post.findUnique({
      where: { id: id }
    });

    if (!post) {
      return h.response({ error: 'Post not found' }).code(404);
    }
    return post;
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message
    });
    response.code(500);
    return response;
  }
};

const getPostByCategory = async (request, h) => {
  try {
    const { categories } = request.params;

    const splitCategory = categories.split('-').join(' ');

    if (!splitCategory) {
      return h.response({ error: error.message }).code(400);
    }

    const post = await prisma.post.findFirst({
      where: {
        categories: {
          contains: splitCategory,
          mode: 'insensitive'
        }
      }
    });
    return post;
  } catch (error) {
    return h.response({ status: 'fail', message: error }).code(500);
  }
};

const updatePost = async (request, h) => {
  try {
    const { id } = request.params;
    const { title, body, categories } = request.payload;
    const file = request.payload.file;

    let imageUrl = null;
    if (file) {
      imageUrl = await uploadToGCS(file);
    }
    const post = await prisma.post.update({
      where: { id: id },
      data: { title, body, categories, imageUrl }
    });
    return post;
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message
    });
    response.code(500);
    return response;
  }
};

const deletePost = async (request, h) => {
  try {
    const { id } = request.params;
    await prisma.post.delete({
      where: { id: id }
    });
    return { message: 'Post deleted sucessfully' };
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message
    });
    response.code(500);
    return response;
  }
};

module.exports = {
  addPosts,
  getPosts,
  getPostsById,
  updatePost,
  deletePost,
  getPostByCategory
};
