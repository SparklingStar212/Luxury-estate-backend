export const validate = (schema) => {
  return (req, res, next) => {
    const errors = []

    for (const [field, rule] of Object.entries(schema)) {
      const value = req.body?.[field]

      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`)
        continue
      }

      if (value === undefined || value === null || value === '') {
        continue
      }

      if (rule.type === 'string' && typeof value !== 'string') {
        errors.push(`${field} must be a string`)
      }

      if (rule.type === 'number' && Number.isNaN(Number(value))) {
        errors.push(`${field} must be a number`)
      }

      if (rule.type === 'boolean' && typeof value !== 'boolean' && value !== 'true' && value !== 'false' && value !== '1' && value !== '0') {
        errors.push(`${field} must be a boolean`)
      }

      if (rule.enum && !rule.enum.includes(value)) {
        errors.push(`${field} must be one of: ${rule.enum.join(', ')}`)
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors })
    }

    return next()
  }
}