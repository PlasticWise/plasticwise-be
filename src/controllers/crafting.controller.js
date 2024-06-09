const { uploadToGCS } = require('../utils/upload');
const { prisma } = require('../utils/db');

const addCrafting = async (request, h) => {
  try {
    const { title, tools, equip, howto, categories, type, file } =
      request.payload;
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
        .response({ status: 'fail', message: 'Dibutuhkan gambar' })
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
      data: { title, categories, imageUrl, tools, equip, howto, authorId }
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

const getCrafting = async (request, h) => {
  try {
    const posts = await prisma.crafting.findMany();
    if (!posts) {
      return h.response({ error: 'Tidak ada postingan' }).code(404);
    }
    return posts;
  } catch (error) {
    return h.response({ error: error }).code(500);
  }
};

const getCraftingById = async (request, h) => {
  //TODO: get Data from static json data and storing to database
  try {
    const { id } = request.params;

    const post = await prisma.crafting.findUnique({
      where: { id: id }
    });
    if (!post) {
      return h.response({ error: 'Post tidak ditemukan' }).code(404);
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

const getCraftingByCategory = async (request, h) => {
  try {
    const { categories } = request.params;

    const splitCategories = categories.split('-').join(' ');

    if (!splitCategories) {
      const response = h
        .response({
          status: 'fail',
          message: 'Crafting post tidak ditemukan'
        })
        .code(404);
      return response;
    }

    const post = await prisma.crafting.findFirst({
      where: { categories: { contains: splitCategories, mode: 'insensitive' } }
    });

    return post;
  } catch (error) {
    const response = h
      .response({
        status: 'fail',
        message: error
      })
      .code(500);

    return response;
  }
};

module.exports = {
  addCrafting,
  getCraftingById,
  getCrafting,
  getCraftingByCategory
};
