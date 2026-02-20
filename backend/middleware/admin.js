const { User } = require('../db/models');

const requireAdmin = async (req, res, next) => {
  try {
    const session = req.session;
    if (!session?.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await User.findById(session.userId).select('role status email name').lean();
    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (user.status && user.status !== 'active') {
      return res.status(403).json({ message: 'Account is disabled' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    req.adminUser = user;
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  requireAdmin,
};
