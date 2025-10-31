import ActivityLog from "../models/ActivityLog.js";

/**
 * Lấy danh sách activity logs (Admin only)
 */
export const getActivityLogs = async (req, res) => {
  try {
    const { userId, action, status, page = 1, limit = 20 } = req.query;

    // Build filter
    const filter = {};
    if (userId) filter.userId = userId;
    if (action) filter.action = action;
    if (status) filter.status = status;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Query
    const logs = await ActivityLog.find(filter)
      .populate("userId", "name email role")
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await ActivityLog.countDocuments(filter);

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error("❌ Error fetching logs:", err);
    res.status(500).json({ message: "Lỗi khi lấy logs", error: err.message });
  }
};

/**
 * Lấy logs của user hiện tại
 */
export const getMyLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const logs = await ActivityLog.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await ActivityLog.countDocuments({ userId: req.user.id });

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error("❌ Error fetching my logs:", err);
    res.status(500).json({ message: "Lỗi khi lấy logs", error: err.message });
  }
};

/**
 * Xóa logs cũ (Admin only)
 */
export const cleanupOldLogs = async (req, res) => {
  try {
    const { days = 30 } = req.body;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    const result = await ActivityLog.deleteMany({
      timestamp: { $lt: cutoffDate }
    });

    console.log(`🧹 Cleaned up ${result.deletedCount} old logs (older than ${days} days)`);

    res.json({
      message: `Đã xóa ${result.deletedCount} logs cũ`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error("❌ Error cleaning logs:", err);
    res.status(500).json({ message: "Lỗi khi xóa logs", error: err.message });
  }
};

/**
 * Thống kê activity
 */
export const getActivityStats = async (req, res) => {
  try {
    const stats = await ActivityLog.aggregate([
      {
        $group: {
          _id: "$action",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const statusStats = await ActivityLog.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      actionStats: stats,
      statusStats
    });
  } catch (err) {
    console.error("❌ Error getting stats:", err);
    res.status(500).json({ message: "Lỗi khi lấy thống kê", error: err.message });
  }
};

