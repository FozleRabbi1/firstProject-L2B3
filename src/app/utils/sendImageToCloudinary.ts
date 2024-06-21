import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import multer from 'multer';

export const sendImageToCloudinary = async (
  path: string,
  imageName: string,
) => {
  cloudinary.config({
    cloud_name: config.image_cloud_name,
    api_key: config.image_cloud_api_key,
    api_secret: config.image_cloud_api_secret,
  });

  // Upload an image
  cloudinary.uploader
    .upload(path, { public_id: imageName }, function (err, res) {
      console.log({ res });
    })
    .catch((error) => {
      console.log({ error });
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
