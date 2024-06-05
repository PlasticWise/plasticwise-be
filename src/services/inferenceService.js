const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

process.env.TF_CPP_MIN_LOG_LEVEL = '2';

async function predicClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();
    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    const classes = model.classLabels;

    // const classes = ['Botol Obat', 'Botol Susu Bayi', 'Botol Minum', 'Botol Susu dan Jus', 'Botol yang bisa ditekan', 'CD', 'Kemasan Makanan Beku', 'Kemasan Mentega', 'Makanan Ringan', 'Plastik', 'Sedotan', 'Styrofoam', 'Botol Minyak', 'Botol Plastik', 'Kemasan Detergen', 'Pipa', 'Wadah Makanan Plastik','Galon Plastik','Plastik Kiloan']

    const classResult = tf.argMax(prediction, 1).dataSync()[0];
    const label = classes[classResult];

    let message = `Plastik berasal dari ${label}`;

    // switch(label){
    //   case 'Botol Obat':
    //     bahan_plastik = `Plastik berasal dari ${label}`;
    //     break;
    //   case 'Botol Susu Bayi':
    //     bahan_plastik = `Plastik berasal dari ${label}`
    // }

    // if(label === "Botol Obat"){
    //   explanation = ""
    //   suggestion = ""
    // }
    return { confidenceScore, label, message };
  } catch (error) {
    throw new InputError(`Terjadi kesalahan inputL ${error.message}`);
  }
}

module.exports = predicClassification;
