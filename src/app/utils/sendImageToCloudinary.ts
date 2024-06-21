import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import multer from 'multer';
import fs from 'fs';

cloudinary.config({
  cloud_name: config.image_cloud_name,
  api_key: config.image_cloud_api_key,
  api_secret: config.image_cloud_api_secret,
});

export const sendImageToCloudinary = async (
  path: string,
  imageName: string,
) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      // Upload an image
      .upload(path, { public_id: imageName }, function (error, result) {
        if (error) {
          reject(error);
        }
        resolve(result);
        // delete old file asyncronously
        fs.unlink(path, (err) => {
          if (err) {
            reject(err);
          } else {
            console.log('File is deleted');
          }
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// =========>>> file save করা
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploades/'); // এখানে uploadeds file এর derectory set করা হয়েছে
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
