const { selectAllTopics, selectArticles } = require("./app.models");
const  apiEndpoints  = require("../endpoints.json")


exports.getApiEndpoints = (_, res) => {
  res.status(200).send({ apiEndpoints })
}

exports.getAllTopics = (req, res, next) => {
  selectAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next)
};

exports.getArticles = (req, res, next) => {
  console.log(req.params, "reqparams")
  selectArticles(req.params.article_id)
  .then((articles) => {
    console.log(articles, "articles")
    res.status(200).send( {articles })
  })
  .catch(next)
}

exports.routeNotFound = (req, res) => {
  res.status(404).send({ message: "No path found" });
};
