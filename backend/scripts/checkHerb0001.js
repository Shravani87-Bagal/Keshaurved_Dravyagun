import xlsx from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EXCEL_PATH = path.join(__dirname, '../../Dataset/herbs.xlsx');

const workbook = xlsx.readFile(EXCEL_PATH);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const rawData = xlsx.utils.sheet_to_json(worksheet, { defval: null });

const herb0001 = rawData.find(row => row['record_id'] === 'HERB_REC_0001');

console.log('HERB_REC_0001 Excel data:');
console.log(JSON.stringify(herb0001, null, 2));
