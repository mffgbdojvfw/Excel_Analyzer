const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const File = require('../models/File');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateInsight = async (req, res) => {
  try {
    const fileId = req.params.id;
    const fileDoc = await File.findById(fileId);
    if (!fileDoc) return res.status(404).json({ message: 'File not found' });

    const filePath = path.join(__dirname, '..', 'uploads', fileDoc.filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found on disk' });

    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const parsedData = xlsx.utils.sheet_to_json(worksheet);

    if (!parsedData.length) return res.status(400).json({ message: 'No data in file' });

    const sampleData = parsedData.slice(0, 10); // Keep it concise

    const prompt = `
You are a data analyst. Analyze the following real estate data and summarize trends in 5 bullet points.

Data:
${JSON.stringify(sampleData)}

Only base your summary on this data.
`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    res.status(200).json({
      success: true,
      summary,
    });

  } catch (err) {
    console.error('Insight generation error:', err);
    res.status(500).json({ message: 'Error generating insight' });
  }
};

module.exports = { generateInsight };
