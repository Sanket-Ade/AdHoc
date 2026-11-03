const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${req.method} ${req.url}:`, err.stack || err.message);

    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = errorHandler;
