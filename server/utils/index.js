export const handleError = (e, res) => {
  res.status(500).json({
    message: 'An error ocurred db questions',
    e
  })
}
