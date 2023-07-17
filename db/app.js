const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
const {
  handlePsqlErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./error");
const {
  getAllTopics,
  routeNotFound,
  getApiEndpoints,
  getArticles,
  getCommentsByArticleId,
  getArticleById,
  addArticleComment,
  patchArticleVotes,
  removeCommentById,
} = require("./app.controller");

//EndPoints
app.get("/api", getApiEndpoints);
//Topics
app.get("/api/topics", getAllTopics);
//Articles
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", addArticleComment);
// Votes
app.patch("/api/articles/:article_id", patchArticleVotes);
// Comments
app.delete("/api/comments/:comment_id", removeCommentById)
//Errors
app.all("*", routeNotFound);
app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
