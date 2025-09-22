import { diskStorage } from 'multer';
import { extname } from 'path';

export const createMulterStorage = (folderPath: string) =>
  diskStorage({
    destination: folderPath,
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      callback(
        null,
        `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
      );
    },
  });
