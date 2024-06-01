const { uploadToGCS } = require('../upload');
const { prisma } = require('../utils/db');

const addPosts = async (request, h) => {
  const { author, title, body } = request.payload;
  const file = request.payload.file;

  //validating title and author
  const titleCheck = request.payload.hasOwnProperty('title');
  const authorCheck = request.payload.hasOwnProperty('author');

  if (!titleCheck || !authorCheck) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan postingan'
    });
    response.code(400);
    return response;
  }

  const imageUrl = null;

  if (file) {
    imageUrl = await uploadToGCS(file);
  }

  const post = await prisma.post.create({
    data: {
      title: title,
      author: author,
      uri_thumbnail: imageUrl,
      body: body
    }
  });
  return post;
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

const updatePost = async (request, h) => {
  try {
    const { id } = request.params;
    const { title, content } = request.payload;
    const file = request.payload.file;

    let imageUrl = null;
    if (file) {
      imageUrl = await uploadToGCS(file);
    }
    const post = await prisma.post.update({
      where: { id: id },
      data: { title, content, imageUrl }
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

module.exports = { addPosts, getPosts, getPostsById, updatePost, deletePost };
