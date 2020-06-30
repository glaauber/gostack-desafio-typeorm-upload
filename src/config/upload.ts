import path from 'path';
import multer from 'multer';
import crypto from 'crypto';

const fileUploadFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: fileUploadFolder,
  storage: multer.diskStorage({
    destination: fileUploadFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const filename = `${fileHash}-${file.originalname}`;

      return callback(null, filename);
    },
  }),
};
