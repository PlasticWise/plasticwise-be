const multer = require('multer');
const path = require('path');
const { Storage } = require('@google-cloud/storage');
const { v4: uuidv4 } = require('uuid');

const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  keyFilename: process.env.GCS_KEYFILE
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

const multerStorage = multer.memoryStorage();

const upload = multer({
  stoage: multerStorage,
  fileFilter: (reeq, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      return cb(new Error('Only images are allowed'));
    }
    cb(null, true);
  }
});

const uploadToGCS = file => {
  return new Promise((resolve, reject) => {
    const blob = bucket.file(`${uuidv4()}_${file.originalname}`);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
      predefinedAcl: 'publicRead'
    });
    blobStream.on('error', err => {
      reject(err);
    });
    blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/thumbnail/${blob.name}`;
      resolve(publicUrl);
    });
    blobStream.end(file.buffer);
  });
};

module.exports = { upload, uploadToGCS };
