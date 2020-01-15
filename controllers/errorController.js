// operational error => trusted, known errors
// const AppError = require('./../utils/appError');

// const handleCastErrorDB = err => {
//   const message = `Invalid ${err.path}: ${err.value}.`
//   return new AppError(message, 400);
// }

// const handleDuplicateFieldsDB = err => {
//   const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]

//   const message = `Duplicate field value: ${value}. Please use another value!`
//   return new AppError(message, 400)
// }

// let handleValidationDB = err => {
//   Object.values(err.errors).map(el => el.message)
//   let message = `invalid input data. ${erros.join('. ')}`
//   return new AppError(message, 400)
// }

// let handleJWTError = () => new AppError('invalid token, login again', 401)
// let handleJWTExpire = () => new AppError('yer token has expired', 401)

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message
    })
  }

  console.error('ERROR 💥', err)
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message
  })
}

// const sendErrorProd = (err, req, res) => {
//   if (req.originalUrl.startsWith('/api')) {
//     if (err.isOperational) {
//       return res.status(err.statusCode).json({
//         status: err.status,
//         message: err.message
//       })
//     }
//     console.error('ERROR 💥', err)
//     return res.status(500).json({
//       status: 'error',
//       message: 'Something went very wrong!'
//     })
//   }

//   if (err.isOperational) {
//     return res.status(err.statusCode).render('error', {
//       title: 'Something went wrong!',
//       msg: err.message
//     })
//   }
//   console.error('ERROR 💥', err)
//   return res.status(err.statusCode).render('error', {
//     title: 'Something went wrong!',
//     msg: 'Please try again later.'
//   })
// }

module.exports = (err, req, res, next) => {
  // console.log(err.stack)
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res) }
  // } else if (process.env.NODE_ENV === 'production') {
  //   // console.log('hi')
  //   // due to problem in the prod start script the code in this block is not running.
  //   let error = { ...err }
  //   error.message = err.message

  //   if (error.name === 'CastError') error = handleCastErrorDB(error)
  //   if (error.code === 11000) error = handleDuplicateFieldsDB(error)
  //   if (error.name === 'ValidationError') error = handleValidationDB(error)
  //   if(error.name === 'JsonWebTokenError') error = handleJWTError(error)
  //   if(error.name === 'TokenExpiredError') error = handleJWTExpire(error)
  //   sendErrorProd(error, req, res)
  // }
}
