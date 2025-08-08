
const xlsx = require('xlsx');
const File = require('../models/File');
const path = require('path');
const fs = require("fs")

const uploadExcel = async (req, res) => {
  try {
    console.log("Authenticated user:", req.user);  // 👈 From JWT middleware
    console.log("File:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Parse Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const parsedData = xlsx.utils.sheet_to_json(worksheet);

    // Save file metadata with user ID
    const savedFile = await File.create({
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size, 
      uploadedBy: req.user.userId, // 👈 From decoded JWT
    });


    res.status(200).json({
      message: 'File uploaded and parsed successfully',
      uploadedBy: req.user.userId,
      file: savedFile,
      parsedData,
    });

  

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserFiles = async (req, res) => {
  try {
    const files = await File.find({ uploadedBy: req.user.userId });
    res.json({success:true , files });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching upload history' });
  }
};


const getParsedExcelData = async (req, res) => {
  try {
    const fileId = req.params.id;

    // 1. Find the file metadata by ID
    const fileDoc = await File.findById(fileId);
    if (!fileDoc) {
      return res.status(404).json({ message: 'File not found' });
    }

    // 2. Get the file path from the uploads folder
    const filePath = path.join(__dirname, '..', 'uploads', fileDoc.filename);

    // 3. Parse the Excel file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const parsedData = xlsx.utils.sheet_to_json(worksheet);

    res.status(200).json({
      success: true,
      fileId,
      parsedData
    });

  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ message: 'Server error while reading Excel file' });
  }
};


const getBase64FileById = async (req, res) => {
  try {
    const fileId = req.params.id;

    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ message: 'File not found' });

    const filePath = path.join(__dirname, '..', 'uploads', file.filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const base64 = fileBuffer.toString('base64');

    res.json({
      base64,
      name: file.originalName || file.filename,
    });
  } catch (err) {
    console.error('Error in getBase64FileById:', err);
    res.status(500).json({ message: 'Failed to read file' });
  }
};


const deleteOwnFile = async (req, res) => {
  try {
    console.log("USER in req:", req.user);           // ← should print { userId, role, … }
    console.log("FILE id param:", req.params.id);

    const file = await File.findById(req.params.id);
    console.log("FILE found:", file);                // ← should print whole doc

    if (!file) return res.status(404).json({ error: 'File not found' });

    // safer compare
    if (String(file.uploadedBy) !== String(req.user.userId)) {
      return res.status(403).json({ error: 'You can only delete your own files.' });
    }

    await file.deleteOne();
    return res.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error("DELETE crashed:", err);
    return res.status(500).json({ error: 'Server error' });
  }
};



module.exports = { uploadExcel, getUserFiles, getParsedExcelData,getBase64FileById , deleteOwnFile};
