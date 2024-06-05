const { uploadToGCS } = require('../utils/upload');
const { prisma } = require('../utils/db');

// const addTutorials = async (request, h) => {
//   const { author, title, body } = request.payload;
//   const file = request.payload.file;

//   //validating title and author
//   const titleCheck = request.payload.hasOwnProperty('title');
//   const authorCheck = request.payload.hasOwnProperty('author');

//   if (!titleCheck || !authorCheck) {
//     const response = h.response({
//       status: 'fail',
//       message: 'Gagal menambahkan postingan'
//     });
//     response.code(400);
//     return response;
//   }

//   const imageUrl = null;

//   if (file) {
//     imageUrl = await uploadToGCS(file);
//   }

//   const tutorial = await prisma.tutorial.create({
//     data: {
//       title: title,
//       author: author,
//       uri_thumbnail: imageUrl,
//       body: body
//     }
//   });
//   return tutorial;
// };

const getTutorials = async (request, h) => {
  //TODO: get Data from static json data and storing to database
  try {
    const tutorials = await prisma.tutorial.findMany();
    return tutorials;
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message
    });
    response.code(500);
    return response;
  }
};

const getTutorialsById = async (request, h) => {
  //TODO: get Data from static json data and storing to database
  try {
    const { id } = request.params;

    const tutorial = await prisma.tutorial.findUnique({
      where: { id: id }
    });
    if (!tutorial) {
      return h.response({ error: 'Post not found' }).code(404);
    }
    return tutorial;
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message
    });
    response.code(500);
    return response;
  }
};

// const updateTutorial = async (request, h) => {
//   try {
//     const { id } = request.params;
//     const { title, content } = request.payload;
//     const file = request.payload.file;

//     let imageUrl = null;
//     if (file) {
//       imageUrl = await uploadToGCS(file);
//     }
//     const tutorial = await prisma.tutorial.update({
//       where: { id: id },
//       data: { title, content, imageUrl }
//     });
//     return tutorial;
//   } catch (error) {
//     const response = h.response({
//       status: 'fail',
//       message: error.message
//     });
//     response.code(500);
//     return response;
//   }
// };

// const deleteTutorial = async (request, h) => {
//   try {
//     const { id } = request.params;
//     await prisma.tutorial.delete({
//       where: { id: id }
//     });
//     return { message: 'Tutorial deleted sucessfully' };
//   } catch (error) {
//     const response = h.response({
//       status: 'fail',
//       message: error.message
//     });
//     response.code(500);
//     return response;
//   }
// };

module.exports = {
  // addTutorials,
  getTutorials,
  getTutorialsById
  // updateTutorial,
  // deleteTutorial
};
