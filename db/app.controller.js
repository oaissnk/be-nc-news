const { selectAllTopics, selectArticles, selectCommentsByArticleId, selectArticleById, insertArticleComment} = require("./app.models");
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
  selectArticles()
  .then((articles) => {
    res.status(200).send( {articles })
  })
  .catch(next)
}

exports.getArticleById = (req, res, next) => {
  if (isNaN(req.params.article_id)) {
    return next({ status:400, message: "Invalid Article ID !"})
  }
  selectArticleById(req.params.article_id)
  .then((article) => {
    res.status(200).send( {article} )
  })
  .catch(next)
}

exports.addArticleComment = (req, res) => {
  if (isNaN(req.params.article_id)) {
    return next({ status:400, message: "Invalid Article ID !"})
  }
  insertArticleComment(req.body, req.params.article_id)
    .then((comment) => res.status(201).send({ comment }));
};

exports.routeNotFound = (req, res) => {
  res.status(404).send({ message: "No path found" });
};

exports.getCommentsByArticleId = (req, res, next) => {
  if (isNaN(req.params.article_id)) {
    return next({ status:400, message: "Invalid Article ID !"})
  }
  selectCommentsByArticleId(req.params.article_id)
  .then((comments) => {
    if (!comments.length ) {
      return Promise.reject({ status:404, message: "No Comments Found"})
    }
    res.status(200).send( {comments} )
  })
  .catch(next)
}
