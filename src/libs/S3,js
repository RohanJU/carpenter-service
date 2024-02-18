const AWS = require('aws-sdk');
const sharp = require('sharp');
const config = require('../config');

const s3 = new AWS.S3({
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
    region: config.aws.region,
  });

const uploadImageToS3 = async (file, newFileName) => {
    const { originalname, buffer } = file;
    const fileExt = originalname.split('.').pop();
  
    if (fileExt !== 'png' && fileExt !== 'jpg' && fileExt !== 'jpeg') {
      throw new Error('Invalid file type');
    }
  
    const image = await sharp(buffer)
      .resize(400, 800)
      .png()
      .toBuffer();
  
    const fileName = `${newFileName}.${fileExt}`;
  
    const s3Params = {
      Bucket: config.aws.bucketName,
      Key: fileName,
      Body: image,
      ContentType: 'image/png'
    };
  
    const { Location } = await s3.upload(s3Params).promise();
  
    return Location;
  };

const getSignedUrl = async (url) => {
    const key = url.split('/').pop();
    const params = {
        Bucket: config.aws.bucketName,
        Key: key,
        Expires: 60 * 60 * 24 * 7,
    };

    return  s3.getSignedUrlPromise('getObject', params);
}

  const deleteImageFromS3 = async (key) => {
    const params = {
        Bucket: config.aws.bucketName,
        Key: key,
    };

    await s3.deleteObject(params).promise();
};

const uploadVideoToS3 = async (file, newFileName) => {
    const { originalname, buffer } = file;
    const fileExt = originalname.split('.').pop();

    if (fileExt !== 'mp4') {
        throw new Error('Invalid file type');
    }

    const fileName = `${newFileName}.${fileExt}`;

    const s3Params = {
        Bucket: config.aws.bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: 'image/mp4'
    };

    const { Location } = await s3.upload(s3Params).promise();

    return Location;
};

const deleteVideoFromS3 = async (key) => {
    const params = {
        Bucket: config.aws.bucketName,
        Key: key,
    };

    await s3.deleteObject(params).promise();
};

  module.exports = {
    uploadImageToS3,
    getSignedUrl,
    deleteImageFromS3,
    uploadVideoToS3,
    deleteVideoFromS3
  };