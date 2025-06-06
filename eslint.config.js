import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configPath = path.join(__dirname, '.eslintrc.json');

export default JSON.parse(fs.readFileSync(configPath, 'utf8'));
