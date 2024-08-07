import path from 'path';
import fs from 'fs';

export default class FsUtils {
  static createDirSync(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  static clearDirSync(dirPath) {
    const files = fs.readdirSync(dirPath);
    files.forEach((file) => fs.unlinkSync(path.join(dirPath, file)));
  }
}
