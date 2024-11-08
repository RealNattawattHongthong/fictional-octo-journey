import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(process.cwd(), '/public/uploads');
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Error parsing the files' });
      return;
    }

    const filePath = files.file.path;

    // Call your Python API here with the filePath
    const response = await fetch('http://localhost:5000/api/predict', {
      method: 'POST',
      body: fs.createReadStream(filePath),
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });

    const data = await response.json();
    const result = data.result;

    res.status(200).json({ result });
  });
}