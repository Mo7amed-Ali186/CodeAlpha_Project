export const asyncHandler = (fun) => {
  return (req, res, next) => {
    fun(req, res, next).catch(error => {
      if (error.code === 11000) {
        return res.status(400).json({ globalMessage: 'Duplicate key error', stack: error.stack });
      }
      return next(new Error(error.message, { cause: error.cause || 500 }));
    });
  };
};


export const globalError = (error, req, res, next) => {
  if (req.validationResult && req.validationResult.details) {
    return res.status(error.cause || 400).json({ globalMessage: error.message, details: req.validationResult.details });
  }
  if (process.env.MOOD === 'DEV') {
    return res.status(error.cause || 500).json({ globalMessage: error.message, stack: error.stack });
  }
  return res.status(error.cause || 500).json({ globalMessage: error.message });
};
