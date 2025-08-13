import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import Task from "./models/Task.js";
import Notification from "./models/Notification.js";

const resolvers = {
  Query: {
    me: (_, __, { user }) => user || null,

    tasks: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return Task.find({}).populate("assignee createdBy");
    },

    notifications: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return Notification.find({ user: user.id }).sort({ createdAt: -1 });
    },

    allUsers: async (_, __, { user }) => {
      if (!user || user.role !== "admin") throw new Error("Not authorized");
      return User.find({});
    }
  },

  Mutation: {
    register: async (_, { name, email, password }) => {
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashed });
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET
      );
      return { token, user };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Invalid credentials");
      }
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET
      );
      return { token, user };
    },

    createTask: async (_, { title, description, assigneeId }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const task = await Task.create({
        title,
        description,
        assignee: assigneeId,
        createdBy: user.id
      });
      await Notification.create({
        user: assigneeId,
        message: `You have been assigned: ${title}`
      });
      return task.populate("assignee createdBy");
    },

    updateTaskStatus: async (_, { taskId, status }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return Task.findByIdAndUpdate(
        taskId,
        { status },
        { new: true }
      ).populate("assignee createdBy");
    },

    markNotificationRead: async (_, { notificationId }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return Notification.findByIdAndUpdate(
        notificationId,
        { read: true },
        { new: true }
      );
    },

    deleteUser: async (_, { userId }, { user }) => {
      if (!user || user.role !== "admin") throw new Error("Not authorized");
      await User.findByIdAndDelete(userId);
      return true;
    }
  }
};

export default resolvers;
