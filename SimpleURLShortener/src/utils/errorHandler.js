// export const asyncHandler = (fun) => {
//   return (req, res, next) => {
//       fun(req, res, next).catch(error => {
//           return next(new Error(error, { cause: 500 }))
//       });
//   };
// };

// export const globalError = (error, req, res, next) => {
//   if (req.validationResult && req.validationResult.details) {
//     return res.status(error.cause || 400).json({ globalMessage: error.message, details: req.validationResult.details });
//   }
//   if (process.env.MOOD === 'DEV') {
//     return res.status(error.cause || 500).json({ globalMessage: error.message, stack: error.stack });
//   }
//   return res.status(error.cause || 500).json({ globalMessage: error.message });
// };
export const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const globalError = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
};
