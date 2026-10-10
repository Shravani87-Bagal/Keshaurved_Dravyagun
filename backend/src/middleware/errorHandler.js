export function errorHandler(err, req, res, _next) {
  req.log?.error({ err }, 'request failed');

  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors,
    });
  }

  if (err.code === 'FORBIDDEN') {
    return res.status(403).json({
      error: err.message,
    });
  }

  const status = err.statusCode || 500;
  return res.status(status).json({
    error: status === 500 ? 'Internal server error' : err.message,
  });
}
