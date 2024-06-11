const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predicClassification(model, image) {
  try {
    // Decode and preprocess the image
    let tensor = tf.node.decodeJpeg(image);
    console.log('Initial tensor shape:', tensor.shape);

    tensor = tensor.resizeNearestNeighbor([224, 224]).toFloat();
    console.log('Tensor after resizing:', tensor.shape);

    tensor = tensor.div(tf.scalar(255.0));
    console.log('Tensor after normalization:', tensor.arraySync());

    tensor = tensor.expandDims();
    console.log('Tensor after expanding dims:', tensor.shape);

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    console.log(await prediction);
    console.log('score: ', score);
    const confidenceScore = Math.max(...score) * 100;
    console.log('confidence score: ', confidenceScore);

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
    console.log('class: ', classes);

    const classResult = tf.argMax(prediction, 1).dataSync()[0];
    console.log('class result: ', classResult);
    const label = classes[classResult];
    console.log('label: ', label);

    let message = `Plastik berasal dari ${label}`;

    return { confidenceScore, label, message };
  } catch (error) {
    throw new InputError(`Terjadi kesalahan input ${error.message}`);
  }
}

module.exports = predicClassification;
