export const uploadAsset = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'File is required' })
  }

  return res.status(201).json({
    file: {
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      filename: req.file.filename || req.file.originalname,
    },
  })
}