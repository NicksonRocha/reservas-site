
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const tmpFolder = path.resolve(__dirname, '..', 'tmp');

const fileFilter = (req, file, callback) => {
  
  const allowedTypes = /jpeg|jpg|png/;
  const isMimeTypeValid = allowedTypes.test(file.mimetype); 
  const isExtensionValid = allowedTypes.test(path.extname(file.originalname).toLowerCase()); 

  if (isMimeTypeValid && isExtensionValid) {
    callback(null, true); 
  } else {
    callback(new Error('Apenas imagens PNG, JPG e JPEG são permitidas.')); 
  }
};

module.exports = {
  directory: tmpFolder,
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex'); 
      const filename = `${fileHash}-${file.originalname}`;
      callback(null, filename);
    },
  }),
  fileFilter, 
};
