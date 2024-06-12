const tf = require('@tensorflow/tfjs-node');

async function loadModel() {
  const model = tf.loadLayersModel(process.env.MODEL_URL);

  // const inputLayer = tf.layers.input({ shape: [224, 224, 3] });
  // const newOutput = model.app(inputLayer);

  // const newModel = tf.model({ inputs: inputLayer, outputs: newOutput });

  return model;
}

module.exports = loadModel;
