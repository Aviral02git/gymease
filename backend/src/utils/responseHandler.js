function sendSuccess(res, data, message = 'Success', status = 200) {
  return res.status(status).json({
    success: true,
    message,
    data
  });
}

function sendError(res, message = 'Something went wrong', status = 500, details = null) {
  return res.status(status).json({
    success: false,
    message,
    details
  });
}

function notFoundHandler(req, res) {
  return sendError(res, `Route not found: ${req.originalUrl}`, 404);
}

function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  return sendError(res, err.message || 'Internal server error', status);
}

module.exports = {
  sendSuccess,
  sendError,
  notFoundHandler,
  errorHandler
};
