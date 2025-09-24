import { diskStorage } from 'multer';
import { extname } from 'path';
import { promises as fs } from 'fs';

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

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function deleteFile(filePath: string): Promise<void> {
  await fs.unlink(filePath);
}
