const {
  selectAllTopics,
  selectArticles,
  selectCommentsByArticleId,
  selectArticleById,
  insertArticleComment,
  updateArticleVotes,
  deleteCommentById,
} = require("./app.models");
const apiEndpoints = require("../endpoints.json");

exports.getApiEndpoints = (_, res) => {
  res.status(200).send({ apiEndpoints });
};

exports.getAllTopics = (req, res, next) => {
  selectAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  if (isNaN(req.params.article_id)) {
    return next({ status: 400, message: "Invalid Article ID !" });
  }
  selectArticleById(req.params.article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.addArticleComment = (req, res, next) => {
  if (isNaN(req.params.article_id)) {
    return next({ status: 400, message: "Invalid Article ID !" });
  }
  insertArticleComment(req.body, req.params.article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.routeNotFound = (req, res) => {
  res.status(404).send({ message: "No path found" });
};

exports.getCommentsByArticleId = (req, res, next) => {
  if (isNaN(req.params.article_id)) {
    return next({ status: 400, message: "Invalid Article ID !" });
  }
  selectCommentsByArticleId(req.params.article_id)
    .then((comments) => {
      if (!comments.length) {
        return Promise.reject({ status: 404, message: "No Comments Found" });
      }
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  if (isNaN(req.params.article_id)) {
    return next({ status: 400, message: "Invalid Article ID !" });
  }

  const newVote = req.body.inc_votes;

  if (newVote === undefined) {
    return next({ status: 400, message: "body must include inc_votes" });
  }

  if (isNaN(newVote)) {
    return next({ status: 400, message: "inc_votes must be a number" });
  }

  updateArticleVotes(req.params.article_id, newVote)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.removeCommentById = (req, res, next) => {
  if (isNaN(req.params.comment_id)) {
    return next({ status: 400, message: "Comment ID must be a number" });
  }
  const commentId = req.params.comment_id;
  deleteCommentById(commentId)
    .then((result) => {
      if (result.rowCount === 0) {
        return next({ status: 404, message: "Comment does not exist" });
      }
    })
    .then(() => {
      res.status(204).send({});
    })
    .catch(next);
};
