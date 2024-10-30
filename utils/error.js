const ErrorHandler = (err, req, res, next) => {
  console.log("MiddleWare Error Handler");
  const errorStatus = err.statusCode || 500;
  const errMsg = err.message || "Something went wrong";
  res.staus(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errMsg,
  });
};

module.exports = ErrorHandler;
