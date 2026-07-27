const errormiddleware = (err, req, res, next) => {
  const status = err.status || 400;
  const message = err.message || 'backend error';
  const extraDetails = err.extraDetails || "Server error From backend";

  return res.status(status).json({
    message,
    extraDetails
  });
};

module.exports = errormiddleware;
