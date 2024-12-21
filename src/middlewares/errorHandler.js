export const errorHandler = (err, req, res, next) => {
  console.error('Error details:', err);

  const status = err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  res.status(status).json({
    error: {
      message: message,
      status: status,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });
};

