import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { output } = req.body;
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} - ${output}\n`;
    const logFilePath = path.join(process.cwd(), 'outputs.log');
    fs.appendFileSync(logFilePath, logEntry);
    res.status(200).json({ message: 'Output logged successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
