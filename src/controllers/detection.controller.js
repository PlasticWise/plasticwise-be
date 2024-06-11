const predictClassification = require('../services/inferenceService');
const { v4: uuidv4 } = require('uuid');

async function postDetectHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  try {
    const { confidenceScore, label, message } = await predictClassification(
      model,
      image
    );

    console.log(confidenceScore);
    console.log(label);
    console.log(message);
    const id = uuidv4();
    const createdAt = new Date().toISOString();

    const data = {
      id: id,
      result: label,
      message: message,
      createdAt: createdAt
    };

    const response = h.response({
      status: 'success',
      message:
        confidenceScore > 99
          ? 'Model is predicted successfully.'
          : 'Model is predicted successfully but under threshold. Please use the correct picture',
      confidence: confidenceScore,
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
