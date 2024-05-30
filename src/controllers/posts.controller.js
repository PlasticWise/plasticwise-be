const addPosts = (request, h) => {
  const { author, title, uri_thumbnail, body } = request.payload;

  //validating title and author
  const titleCheck = request.payload.hasOwnProperty('title');
  const authorCheck = request.payload.hasOwnProperty('author');

  if (!titleCheck || !authorCheck) {
    const res = h.response({
      status: 'fail',
      message: 'Gagal menambahkan postingan'
    });
    res.code(400);
    return res;
  }
};

module.exports = { addPosts };
