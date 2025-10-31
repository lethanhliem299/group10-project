import ActivityLog from "../models/ActivityLog.js";
import User from "../models/User.js";

// Lấy tất cả logs (Admin only)
export const getAllLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      userId,
      action,
      method,
      startDate,
      endDate,
    } = req.query;

    // Build query filters
    const query = {};

    if (userId) query.userId = userId;
    if (action) query.action = { $regex: action, $options: "i" };
    if (method) query.method = method;

    // Date range filter
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    // Pagination
    const skip = (page - 1) * limit;
    const total = await ActivityLog.countDocuments(query);

    const logs = await ActivityLog.find(query)
      .populate("userId", "name email role")
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    res.json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      logs,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Lấy logs của 1 user cụ thể (Admin only)
export const getUserLogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    const skip = (page - 1) * limit;
    const total = await ActivityLog.countDocuments({ userId });

    const logs = await ActivityLog.find({ userId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      logs,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Lấy logs của chính mình (User đã login)
export const getMyLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;
    const total = await ActivityLog.countDocuments({ userId: req.user.id });

    const logs = await ActivityLog.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    res.json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      logs,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Thống kê logs (Admin only)
export const getLogStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = {};
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const [
      totalRequests,
      successfulRequests,
      failedRequests,
      requestsByMethod,
      topEndpoints,
      activeUsers,
    ] = await Promise.all([
      // Tổng số requests
      ActivityLog.countDocuments(query),

      // Requests thành công (2xx, 3xx)
      ActivityLog.countDocuments({
        ...query,
        statusCode: { $lt: 400 },
      }),

      // Requests thất bại (4xx, 5xx)
      ActivityLog.countDocuments({
        ...query,
        statusCode: { $gte: 400 },
      }),

      // Phân theo method
      ActivityLog.aggregate([
        { $match: query },
        { $group: { _id: "$method", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // Top endpoints
      ActivityLog.aggregate([
        { $match: query },
        { $group: { _id: "$endpoint", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      // Số user active
      ActivityLog.distinct("userId", {
        ...query,
        userId: { $ne: null },
      }),
    ]);

    res.json({
      totalRequests,
      successfulRequests,
      failedRequests,
      requestsByMethod,
      topEndpoints,
      activeUsersCount: activeUsers.length,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Xóa logs cũ (Admin only)
export const clearOldLogs = async (req, res) => {
  try {
    const { days = 30 } = req.body;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await ActivityLog.deleteMany({
      timestamp: { $lt: cutoffDate },
    });

    res.json({
      message: `Đã xóa ${result.deletedCount} logs cũ hơn ${days} ngày`,
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

