const authService = require('../services/authService');

const signup = async (req, res) => {
  const payload = await authService.signup(req.body);
  return res.json(payload);
};

const login = async (req, res) => {
  const payload = await authService.login(req.body);
  return res.json(payload);
};

const forgotPassword = async (req, res) => {
  const payload = await authService.forgotPassword(req.body);
  return res.json(payload);
};

const logout = async (req, res) => {
  const payload = await authService.logout(req.body);
  return res.json(payload);
};

const me = async (req, res) => {
  const payload = await authService.getMe(req.session);
  return res.json(payload);
};

const changePassword = async (req, res) => {
  const payload = await authService.changePassword(req.session, req.body);
  return res.json(payload);
};

const deleteAccount = async (req, res) => {
  const payload = await authService.deleteAccount(req.session);
  return res.json(payload);
};

module.exports = {
  signup,
  login,
  forgotPassword,
  logout,
  me,
  changePassword,
  deleteAccount,
};
