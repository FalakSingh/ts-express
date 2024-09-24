import multer from 'multer';
import path from 'path';

const folderObj: Record<string, string> = {
  image: 'images',
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../../public'));
  },
  filename: function (req, file, cb) {
    const filename = folderObj[file.fieldname] + '/' + Date.now() + '-' + file.originalname;
    cb(null, filename);
  },
});

const upload = multer({ storage }).fields([{ name: 'image', maxCount: 1 }]);

export { upload };
