const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  if (err.name === 'CastError') {
    res.status(404);
    return res.json({ message: 'Resource not found' });
  }

  if (err.code === 11000) {
    res.status(409);
    return res.json({ message: 'Duplicate field value', fields: err.keyValue });
  }

  if (err.name === 'ZodError') {
    res.status(422);
    return res.json({
      message: 'Validation failed',
      errors: err.errors.map((item) => ({ path: item.path.join('.'), message: item.message }))
    });
  }

  res.status(statusCode).json({
    message: err.message || 'Server error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};

module.exports = { notFound, errorHandler };
