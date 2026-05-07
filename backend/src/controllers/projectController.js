const asyncHandler = require('../utils/asyncHandler');
const Project = require('../models/Project');
const Task = require('../models/Task');
const { canSeeEverything } = require('../utils/roles');

const projectPopulate = [
  { path: 'owner', select: 'name email role title avatarColor' },
  { path: 'members', select: 'name email role title avatarColor' }
];

const visibleProjectFilter = async (user) => {
  if (canSeeEverything(user)) return {};

  const assignedProjectIds = await Task.distinct('project', { assignees: user._id });
  return {
    $or: [{ members: user._id }, { _id: { $in: assignedProjectIds } }]
  };
};

const listProjects = asyncHandler(async (req, res) => {
  const filter = await visibleProjectFilter(req.user);
  const projects = await Project.find(filter)
    .populate(projectPopulate)
    .sort({ updatedAt: -1 });
  res.status(200).json(projects);
});

const createProject = asyncHandler(async (req, res) => {
  const payload = req.validated.body;
  const memberSet = new Set([req.user._id.toString(), ...payload.members]);
  const project = await Project.create({
    ...payload,
    owner: req.user._id,
    members: Array.from(memberSet)
  });

  const populated = await project.populate(projectPopulate);
  res.status(201).json(populated);
});

const getProject = asyncHandler(async (req, res) => {
  const filter = await visibleProjectFilter(req.user);
  const project = await Project.findOne({ _id: req.params.id, ...filter }).populate(projectPopulate);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const taskFilter = canSeeEverything(req.user)
    ? { project: project._id }
    : { project: project._id, assignees: req.user._id };

  const tasks = await Task.find(taskFilter)
    .populate('assignees', 'name email role title avatarColor')
    .populate('createdBy', 'name email role title avatarColor')
    .sort({ dueDate: 1 });

  res.status(200).json({ project, tasks });
});

const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  Object.assign(project, req.validated.body);
  if (req.validated.body.members) {
    project.members = Array.from(new Set([project.owner.toString(), ...req.validated.body.members]));
  }

  await project.save();
  res.status(200).json(await project.populate(projectPopulate));
});

const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  await Task.deleteMany({ project: project._id });
  await project.deleteOne();
  res.status(200).json({ message: 'Project and related tasks deleted' });
});

const addMembers = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  project.members = Array.from(new Set([...project.members.map(String), ...req.validated.body.members]));
  await project.save();
  res.status(200).json(await project.populate(projectPopulate));
});

const removeMember = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  project.members = project.members.filter((member) => member.toString() !== req.params.userId);
  await project.save();
  res.status(200).json(await project.populate(projectPopulate));
});

const analytics = asyncHandler(async (req, res) => {
  const filter = await visibleProjectFilter(req.user);
  const projects = await Project.find(filter).select('_id');
  const projectIds = projects.map((project) => project._id);
  const taskFilter = canSeeEverything(req.user) ? {} : { assignees: req.user._id };

  const [tasks, statusGroups, recent] = await Promise.all([
    Task.find({ project: { $in: projectIds }, ...taskFilter }),
    Task.aggregate([
      { $match: { project: { $in: projectIds }, ...taskFilter } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    Task.find({ project: { $in: projectIds }, ...taskFilter })
      .populate('project', 'name color')
      .populate('assignees', 'name avatarColor')
      .sort({ updatedAt: -1 })
      .limit(8)
  ]);

  const now = new Date();
  res.status(200).json({
    totalProjects: projects.length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter((task) => task.status === 'completed').length,
    overdueTasks: tasks.filter((task) => task.status !== 'completed' && task.dueDate < now).length,
    statusGroups,
    recent
  });
});

module.exports = {
  listProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  addMembers,
  removeMember,
  analytics
};
