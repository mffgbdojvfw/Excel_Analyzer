

const File = require('../models/File');
const User = require("../models/User.js")
const Insight = require("../models/Insight");


const fs = require('fs');
const path = require('path');

// const getAllFiles = async (req, res) => {
//   try {
//     const files = await File.find().populate('uploadedBy', 'name email');
//     res.status(200).json({ files });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


const getAllFiles = async (req, res) => {
  try {
    const files = await File.find()
      .sort({ uploadedAt: -1 }) // newest first
      .limit(100); // ✅ only latest 100
    res.status(200).json({ files });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch files' });
  }
};


const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFile = await File.findByIdAndDelete(id);

    if (!deletedFile) {
      return res.status(404).json({ message: 'File not found' });
    }

    // 🛡️ Safety check to ensure filename exists
    if (deletedFile.fileName) {
      const filePath = path.join(__dirname, '../uploads', deletedFile.fileName);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('File delete failed from disk:', err);
        } else {
          console.log('File deleted from disk:', filePath);
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'File deleted successfully',
      deletedFile,
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Error deleting file', error: error.message });
  }
};






// 3. Get All Users
// const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find({}, '-password'); // Exclude passwords
//     res.json({ users });
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching users' });
//   }
// };



// GET /admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('name email active createdAt')
      .sort({ createdAt: -1 }) // newest users first
      .limit(100); // ✅ limit
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};



// 5. Toggle User Status (active/inactive)

// 6. Get Insight Usage Logs per user
const getInsightUsageLogs = async (req, res) => {
  try {
    const logs = await Insight.aggregate([
      {
        $group: {
          _id: '$userId',
          totalInsights: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 0,
          userId: '$user._id',
          email: '$user.email',
          role: '$user.role',
          totalInsights: 1,
        },
      },
    ]);

    res.json({ logs });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch insight logs' });
  }
};

const getUploadCounts = async (req, res) => {
  try {
    const data = await File.aggregate([
      {
        $group: {
          _id: '$uploadedBy',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          userId: '$_id',
          name: '$user.name',
          email: '$user.email',
          count: 1
        }
      }
    ]);

    res.status(200).json({ data });
  } catch (error) {
    console.error('Error in upload count aggregation:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// 7. Get System Alerts (from logs.json or static array)
const getSystemAlerts = async (req, res) => {
  try {
    const logsPath = path.join(__dirname, '../logs/system_logs.json');
    const logs = fs.existsSync(logsPath)
      ? JSON.parse(fs.readFileSync(logsPath, 'utf-8'))
      : [
          { type: 'warning', message: 'Low disk space', timestamp: new Date() },
          { type: 'error', message: 'Failed to backup DB', timestamp: new Date() },
        ];

    res.json({ alerts: logs });
  } catch (err) {
    res.status(500).json({ message: 'Error reading system alerts' });
  }
};


// Get User Signups Over Time
const getUserSignupStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching signup stats', error: err.message });
  }
};





module.exports = { getAllFiles,deleteFile,getAllUsers,getInsightUsageLogs,getSystemAlerts,getUploadCounts, getUserSignupStats };

