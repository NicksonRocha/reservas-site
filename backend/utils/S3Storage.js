
const aws = require('aws-sdk');
const path = require('path');
const fs = require('fs');
const multerConfig = require('../config/multer');

class S3Storage {
    constructor() {
        this.client = new aws.S3({
            region: 'sa-east-1', 
        });
    }

    async saveFile(filename) {
        const originalPath = path.resolve(multerConfig.directory, filename);
        
        const ContentType = mime.lookup(originalPath);

        if(!ContentType) {
            throw new Error("Não achou o tipo de conteúdo do arquivo");
        }

        const fileContent = await fs.promises.readFile(originalPath);

        this.client.putObject({
            Bucket: 'reservas-bucket',
            Key: filename,
            Body: fileContent,
            ContentType,
        })
        .promise(); 

        await fs.promises.unlink(originalPath);
    }

    async deleteFile(filename) {
        await this.client.deleteObject({
            Bucket: 'reservas-bucket',
            Key: filename,
        })
        .promise(); 
    }
}

module.exports = S3Storage;