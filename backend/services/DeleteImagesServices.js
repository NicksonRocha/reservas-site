const S3Storage = require('../utils/S3Storage')

class DeleteImagesServices {
    async execute(filename) {
        const s3Storage = new S3Storage();

        if (!filename) {
            throw new Error('Filename is required');
        }

        await s3Storage.deleteFile(filename);
    }
}

module.exports = DeleteImagesServices