const { selectAllTopics } = require("./app.models");
exports.getAPI = (_, res) => {
  res.status(200).send({ message: "all ok" });
};

exports.getAllTopics = (req, res) => {
  selectAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.routeNotFound = (req, res) => {
  res.status(404).send({ message: "No path found" });
};
