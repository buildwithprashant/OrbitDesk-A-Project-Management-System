const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);

    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing. Add it to backend/.env');
    }

    const connection = await mongoose.connect(process.env.MONGO_URI);
    const User = require('../models/User');
    const Task = require('../models/Task');
    const Project = require('../models/Project');
    await User.updateMany({ role: 'member' }, { role: 'user' });
    await Task.updateMany({ status: 'todo' }, { status: 'Pending' });
    await Task.updateMany({ status: 'in-progress' }, { status: 'In Progress' });
    await Task.updateMany({ status: 'completed' }, { status: 'Completed' });
    const assignedTasks = await Task.find({ assignees: { $exists: true, $ne: [] } }).select('project assignees');
    await Promise.all(
      assignedTasks.map((task) =>
        Project.findByIdAndUpdate(task.project, {
          $addToSet: { members: { $each: task.assignees } }
        })
      )
    );

    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
