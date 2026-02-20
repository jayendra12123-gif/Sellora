const { getUserPreferences, setUserPreferences } = require('./userService');

const getPreferences = async (session) => getUserPreferences(session.userId);

const updatePreferences = async (session, payload) => {
  const { emailNotifications, smsNotifications, theme } = payload;

  const updates = {};
  if (emailNotifications !== undefined) updates.emailNotifications = emailNotifications;
  if (smsNotifications !== undefined) updates.smsNotifications = smsNotifications;
  if (theme !== undefined) updates.theme = theme;

  return setUserPreferences(session.userId, updates);
};

module.exports = {
  getPreferences,
  updatePreferences,
};
