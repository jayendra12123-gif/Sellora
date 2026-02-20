const getHealthStatus = () => ({
  ok: true,
  service: 'sellora-backend',
  timestamp: new Date().toISOString()
});

module.exports = { getHealthStatus };
