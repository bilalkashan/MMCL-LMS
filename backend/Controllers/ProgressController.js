// const mongoose = require('mongoose');
// const CourseProgress = require("../models/CourseProgress");

// const getEmployeeProgress = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const progress = await CourseProgress.aggregate([
//       { $match: { userId: mongoose.Types.ObjectId(userId) } },
//       {
//         $group: {
//           _id: '$status',
//           count: { $sum: 1 }
//         }
//       }
//     ]);
    
//     const result = { completed: 0, in_progress: 0, incomplete: 0 };
//     progress.forEach(item => {
//       result[item._id] = item.count;
//     });
//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// module.exports = { getEmployeeProgress };


const mongoose = require('mongoose');
const CourseProgress = require("../models/CourseProgress");

const getEmployeeProgress = async (req, res) => {
  try {
    const userId = req.params.userId;

    const progress = await CourseProgress.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const result = [
      { name: 'Completed', value: 0 },
      { name: 'In Progress', value: 0 },
      { name: 'Incomplete', value: 0 }
    ];

    progress.forEach(item => {
      if (item._id === 'completed') result[0].value = item.count;
      if (item._id === 'in_progress') result[1].value = item.count;
      if (item._id === 'incomplete') result[2].value = item.count;
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMonthlyProgress = async (req, res) => {
  try {
    const userId = req.params.userId;

    const data = await CourseProgress.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            status: "$status"
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // Format into month-wise data
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString('default', { month: 'short' }),
      completed: 0,
      in_progress: 0,
      incomplete: 0,
    }));

    data.forEach(item => {
      const idx = item._id.month - 1;
      months[idx][item._id.status] = item.count;
    });

    res.json(months);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getEmployeeProgress,
  getMonthlyProgress
};

