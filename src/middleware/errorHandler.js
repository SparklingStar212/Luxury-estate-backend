export const notFoundHandler = (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` })
  }

  return next()
}

export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal server error'

  res.status(statusCode).json({ message })
}
