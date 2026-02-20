const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const status = err?.status;
  if (Number.isInteger(status)) {
    return res.status(status).json({
      message: err.message || 'Request failed',
      ...(err.details !== undefined ? { details: err.details } : {}),
    });
  }

  console.error('Unhandled error:', err);
  return res.status(500).json({ message: 'Unexpected server error' });
};

module.exports = { errorHandler };
