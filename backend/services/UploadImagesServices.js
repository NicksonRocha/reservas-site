const S3Storage = require('../utils/S3Storage')

class UploadImagesServices {
    async execute(file) {
        const s3Storage = new S3Storage();

        await s3Storage.saveFile(file.filename);
    }
}

module.exports = UploadImagesServices