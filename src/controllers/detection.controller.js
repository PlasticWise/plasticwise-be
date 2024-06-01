const predictDetection = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');

async function postDetectHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  try {
    const { result, suggestion } = await predictDetection(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id: id,
      result: result,
      suggestion: suggestion,
      createdAt: createdAt
    };

    await storeData(id, data);

    const response = h.response({
      status: 'success',
      message: 'Detection model predicted successfully',
      data: data
    });

    response.code(201);
    return response;
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message
    });
    response.code(500);
    return response;
  }
}

module.exports = { postDetectHandler };
