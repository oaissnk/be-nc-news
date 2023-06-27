const { selectAllTopics } = require("./app.models");
const  apiEndpoints  = require("../endpoints.json")


exports.getApiEndpoints = (_, res) => {
  res.status(200).send({ apiEndpoints })
}

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
