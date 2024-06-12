const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  keyFilename: process.env.GCS_KEYFILE
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

module.exports = { bucket };
