const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { bucket } = require('../utils/gcs');
const Boom = require('@hapi/boom');

// const multerStorage = multer.memoryStorage();

// const upload = multer({
//   storage: multerStorage,
//   fileFilter: (req, file, cb) => {
//     const ext = path.extname(file.originalname).toLowerCase();
//     if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
//       return cb(Boom.badRequest('Only images are allowed'));
//     }
//     cb(null, true);
//   }
// });

const uploadToGCS = file => {
  return new Promise((resolve, reject) => {
    const filename = `${uuidv4()}_${file.hapi.filename}`;
    const blob = bucket.file(`thumbnail/${filename}`);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });
    blobStream.on('error', err => {
      console.error('Error uploading to GCS:', err);
      reject(err);
    });
    blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    });
    blobStream.end(file.buffer);
  });
};

module.exports = { uploadToGCS };
