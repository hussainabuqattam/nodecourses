// Middleware for logging requests
const log = (req, res, next) => {
  // Extracting relevant request information
  const { method, protocol, headers, originalUrl } = req;
  const host = headers.host;

  // Logging the request
  console.log(`${method} ${protocol}://${host}${originalUrl}`);

  // Moving to the next middleware
  next();
};

// Middleware for handling 404 (Not Found) errors
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Passing the error to the error handling middleware
};

// General error handling middleware
// error handler middleware => type 4 middleware
const errorHandler = (err, req, res, next) => {
  // Determining the status code based on the error or defaulting to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Responding with the error message
  res.status(statusCode).json({ message: err.message });
};

module.exports = { log, notFound, errorHandler };
