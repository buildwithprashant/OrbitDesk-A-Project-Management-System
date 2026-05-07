const asyncHandler = require('../utils/asyncHandler');
const Task = require('../models/Task');
const Project = require('../models/Project');
const Comment = require('../models/Comment');
const { canSeeEverything } = require('../utils/roles');

const taskPopulate = [
  { path: 'project', select: 'name color deadline members' },
  { path: 'assignees', select: 'name email role title avatarColor' },
  { path: 'createdBy', select: 'name email role title avatarColor' },
  { path: 'activity.actor', select: 'name avatarColor' }
];

const visibleTaskFilter = (user) => (canSeeEverything(user) ? {} : { assignees: user._id });

const ensureProjectAccess = async (projectId, user) => {
  const project = await Project.findById(projectId);
  if (!project) return null;

  const isMember = project.members.some((member) => member.toString() === user._id.toString());
  if (!canSeeEverything(user) && !isMember) return null;
  return project;
};

const listTasks = asyncHandler(async (req, res) => {
  const filter = { ...visibleTaskFilter(req.user) };
  if (req.query.project) filter.project = req.query.project;
  if (req.query.status) filter.status = req.query.status;

  const tasks = await Task.find(filter).populate(taskPopulate).sort({ dueDate: 1 });
  res.status(200).json(tasks);
});

const createTask = asyncHandler(async (req, res) => {
  const payload = req.validated.body;
  const project = await ensureProjectAccess(payload.project, req.user);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const validAssignees = payload.assignees;

  if (validAssignees.length > 0) {
    project.members = Array.from(new Set([...project.members.map(String), ...validAssignees]));
    await project.save();
  }

  const task = await Task.create({
    ...payload,
    assignees: validAssignees,
    createdBy: req.user._id,
    activity: [{ actor: req.user._id, action: 'created', detail: 'Task created' }]
  });

  res.status(201).json(await task.populate(taskPopulate));
});

const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, ...visibleTaskFilter(req.user) }).populate(taskPopulate);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const comments = await Comment.find({ task: task._id })
    .populate('user', 'name email role title avatarColor')
    .sort({ createdAt: 1 });

  res.status(200).json({ task, comments });
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const next = req.validated.body;
  Object.assign(task, next);
  if (next.assignees?.length) {
    await Project.findByIdAndUpdate(task.project, {
      $addToSet: { members: { $each: next.assignees } }
    });
  }
  task.activity.push({ actor: req.user._id, action: 'updated', detail: 'Task details changed' });
  await task.save();
  res.status(200).json(await task.populate(taskPopulate));
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, ...visibleTaskFilter(req.user) });
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  task.status = req.validated.body.status;
  task.activity.push({ actor: req.user._id, action: 'status_changed', detail: `Moved to ${task.status}` });
  await task.save();
  res.status(200).json(await task.populate(taskPopulate));
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  await Comment.deleteMany({ task: task._id });
  await task.deleteOne();
  res.status(200).json({ message: 'Task deleted' });
});

module.exports = { listTasks, createTask, getTask, updateTask, updateTaskStatus, deleteTask };
