// pages/api/getLogs.ts
import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const logFilePath = path.join(process.cwd(), 'outputs.log');
      const logs = fs.readFileSync(logFilePath, 'utf8');
      res.status(200).json({ success: true, logs });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to read log file' });
    }
  } else {
    // Only allow GET requests
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
