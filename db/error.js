exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23503") {
    res.status(400).send({ message: "Bad request !" });
  } else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.message) {
    res.status(err.status).send({ message: err.message });
  } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ message: "Internal Server Error !" });
};
