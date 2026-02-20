const { Session } = require('../db/models');

const getAuthToken = (req) => req.headers.authorization?.split(' ')[1];

const requireAuth = async (req, res, next) => {
  try {
    const token = getAuthToken(req);
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const session = await Session.findOne({ token }).lean();
    if (!session) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
      await Session.deleteOne({ token }).catch(() => {});
      return res.status(401).json({ message: 'Not authenticated' });
    }

    req.session = session;
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  requireAuth,
  getAuthToken,
};
