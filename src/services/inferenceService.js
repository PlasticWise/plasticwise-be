const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predicClassification(model, image) {
  try {
    // Decode and preprocess the image
    let tensor = tf.node.decodePng(image);

    tensor = tensor.resizeNearestNeighbor([224, 224]).toFloat();

    tensor = tensor.div(tf.scalar(255.0));

    tensor = tensor.expandDims();

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    const classes = [
      'Botol Minum',
      'Botol Minyak',
      'Botol Obat',
      'Botol Plastik',
      'Botol Susu Bayi',
      'Botol Susu dan Jus',
      'Botol yang bisa ditekan',
      'CD',
      'Galon',
      'Kemasan Detergen',
      'Kemasan Makanan Beku',
      'Kemasan Mentega',
      'Makanan Ringan',
      'Pipa',
      'Plastik',
      'Plastik Kiloan',
      'Sedotan',
      'Shampoo',
      'Styrofoam',
      'Wadah Makanan Plastik'
    ];

    const classResult = tf.argMax(prediction, 1).dataSync()[0];
    const label = classes[classResult];

    let message = `Plastik berasal dari ${label}`;

    return { confidenceScore, label, message };
  } catch (error) {
    throw new InputError(`Terjadi kesalahan input ${error.message}`);
  }
}

module.exports = predicClassification;
