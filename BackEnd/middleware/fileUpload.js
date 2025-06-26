const path = require('path');
const multer  = require('multer');
const fs = require('fs');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const event = require('../models/event');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const fileFilter = (req, file, cb) => {
  const mimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

  if(mimeTypes.includes(file.mimetype)){
    return cb(null,true);
  } else {
    cb(new Error('Invalid file type. Only jpeg, jpg, png and gif image files are allowed.'));
  }
}
  
const upload = multer({ 
  dest: 'uploads/',
  limits:{fileSize: 2*1024*1024},
  fileFilter: fileFilter
}).single('image');

exports.fileUpload = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      err.status = 400;
      next(err);
    }
    if (!req.file) {
    return next();
    }
    const file = req.file;
    const fileStream = fs.createReadStream(file.path);
    const uniqueName = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
    console.log("File Name:", uniqueName);
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.originalname,
      Body: fileStream,
      ContentType: file.mimetype,
    };
    s3.send(new PutObjectCommand(uploadParams)).then(() => {
      fs.unlinkSync(file.path);
      req.file.location = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueName}`;
      next();
    }).catch ((err)=> {
      fs.unlinkSync(file.path);
      err.status = 500;
      next(err);
    });    
  });
}

exports.fileDelete = async (event)=> {
  const deleteParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: event.image,
  };
  try {
    await s3.send(new DeleteObjectCommand(deleteParams));
    console.log(`File deleted successfully from S3: ${event.image}`);
  } catch (err) {
    console.error(`Error deleting file from S3: ${err}`);
  }
}